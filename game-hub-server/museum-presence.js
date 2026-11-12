"use strict";

// The signed ticket, never a movement packet, supplies the roster avatar and class.
function createMuseumPresence({ verifyTicket, normalizeAvatarKey, send, prefix = 'MUSEUM',
  initialRoom = 'portrait', roomIds = ['portrait', 'nature', 'story', 'shape', 'space'],
  constrainPosition, spawnZ = 3.75 }) {
  const visitorKey = prefix === 'PARK' ? 'parkVisitor' : 'museumVisitor';
  const classes = new Map();
  const dirty = new Set();
  let broadcastTimer;
  function flush() {
    clearTimeout(broadcastTimer);broadcastTimer=null;
    const keys=[...dirty];dirty.clear();keys.forEach(broadcast);
  }
  function queueBroadcast(key) {
    dirty.add(key);
    if(!broadcastTimer){broadcastTimer=setTimeout(flush,100);broadcastTimer.unref?.();}
  }
  const rooms = new Set(roomIds);
  function position(x, z) {
    if (constrainPosition) return constrainPosition(x, z);
    return {
      x: Math.max(-4.85, Math.min(4.85, Number.isFinite(x) ? x : 0)),
      z: Math.max(-28.6, Math.min(6.5, Number.isFinite(z) ? z : 5.8))
    };
  }
  function broadcast(key) {
    dirty.delete(key);
    const clients = classes.get(key);
    if (!clients) return;
    const visitors = [...clients.values()].map(s => {
      const { classKey, schoolKey, ...visitor } = s.meta[visitorKey];
      return visitor;
    });
    const classOnly = clients.size > 30;
    const classByUser = new Map([...clients.values()].map(s => [s.meta[visitorKey].userId, s.meta[visitorKey].classKey]));
    for (const socket of clients.values()) {
      const ownClass = socket.meta[visitorKey].classKey;
      send(socket, { type: `${prefix}_STATE`, scope: key === "open" ? "open" : classOnly ? "class" : "school",
        visitors: classOnly ? visitors.filter(v => classByUser.get(v.userId) === ownClass) : visitors });
    }
  }
  function leave(socket) {
    const visitor = socket.meta[visitorKey];
    if (!visitor) return;
    const clients = classes.get(visitor.schoolKey);
    if (clients?.get(visitor.userId) === socket) {
      clients.delete(visitor.userId);
      if (clients.size) broadcast(visitor.schoolKey);
      else classes.delete(visitor.schoolKey);
    }
    socket.meta[visitorKey] = null;
  }
  function handle(socket, message) {
    if (message.type === `${prefix}_JOIN`) {
      const identity = verifyTicket(String(message.ticket || "").slice(0, 2048));
      if (!identity) { send(socket, { type: `${prefix}_AUTH_REQUIRED` }); return true; }
      leave(socket);
      const schoolKey = identity.schoolKey || identity.classKey;
      const clients = classes.get(schoolKey) || new Map();
      classes.set(schoolKey, clients);
      const avatarKey = normalizeAvatarKey(identity.avatarKey || "");
      const old = clients.get(identity.userId);
      const slots = [0, 1.3, -1.3, 2.6, -2.6, 3.9, -3.9];
      const candidates = Array.from({length:28}, (_, i) => position(slots[i % slots.length], spawnZ - Math.floor(i / slots.length) * 1.5));
      const occupied = [...clients.values()].map(s => s.meta[visitorKey]).filter(v => v.room === initialRoom);
      const spawn = old?.meta[visitorKey]?.room === initialRoom ? position(old.meta[visitorKey].x, old.meta[visitorKey].z)
        : candidates.find(p => occupied.every(v => Math.hypot(v.x-p.x,v.z-p.z) > .9)) || candidates[clients.size % candidates.length];
      socket.meta[visitorKey] = {
        userId: identity.userId, name: String(identity.name || "").slice(0, 12),
        classKey: identity.classKey, schoolKey, avatarKey, room: initialRoom, ...spawn, yaw: Math.PI, moving: false
      };
      if (old && old !== socket) { old.meta[visitorKey] = null; old.close(4003, "REPLACED"); }
      clients.set(identity.userId, socket);
      send(socket, { type: `${prefix}_JOINED`, userId: identity.userId, avatarKey, position: spawn });
      broadcast(schoolKey);
      return true;
    }
    if (message.type === `${prefix}_MOVE`) {
      const visitor = socket.meta[visitorKey];
      if (!visitor) return true;
      const room = rooms.has(message.room) ? message.room : visitor.room;
      const next = position(message.x, message.z);
      const moved = Math.hypot(next.x - visitor.x, next.z - visitor.z) > .003;
      const moving = visitor.room === room && moved && message.moving === true;
      const yaw = Number.isFinite(message.yaw) ? Math.max(-6.4, Math.min(6.4, message.yaw)) : visitor.yaw;
      const changed = moved || room !== visitor.room || moving !== visitor.moving || Math.abs(yaw-visitor.yaw)>.003;
      visitor.moving = moving;
      Object.assign(visitor, next, { room });
      visitor.yaw = yaw;
      if(changed)queueBroadcast(visitor.schoolKey);
      return true;
    }
    return false;
  }
  return { handle, leave, flush };
}
module.exports = { createMuseumPresence };
