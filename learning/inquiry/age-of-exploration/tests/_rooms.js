'use strict';

async function openRaceRoom(ack, hostSocket) {
  const room = await ack(hostSocket, 'createRoom', { roomType: 'race' });
  if (!room?.ok) throw new Error(room?.error || '도착 경주 방을 만들지 못했습니다.');
  return room;
}

async function joinFreeRoom(ack, socket, name) {
  const room = await ack(socket, 'createRoom', { roomType: 'free' });
  if (!room?.ok) throw new Error(room?.error || '자유 항해 방을 만들지 못했습니다.');
  const joined = await ack(socket, 'joinClass', { roomCode: room.roomCode, name, hostToken: room.hostToken });
  if (!joined?.ok) throw new Error(joined?.error || '자유 항해 방에 들어가지 못했습니다.');
  const started = await ack(socket, 'hostStartFree', {});
  if (!started?.ok) throw new Error(started?.error || '자유 항해를 시작하지 못했습니다.');
  return { ...joined, settings: started.settings, roomCode: room.roomCode, hostToken: room.hostToken };
}

module.exports = { openRaceRoom, joinFreeRoom };
