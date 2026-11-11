'use strict';
const crypto = require('node:crypto');
function signVoyageAvatar(secret, identity, now = Date.now()) {
  if (!secret) throw new Error('Voyage avatar signing is not configured');
  const body = Buffer.from(JSON.stringify({kind:'voyage-avatar', userId:String(identity.userId),
    avatarKey:identity.avatarKey || '', exp:now+10*60*1000})).toString('base64url');
  return body+'.'+crypto.createHmac('sha256',secret).update(body).digest('base64url');
}
function verifyVoyageAvatar(secret, ticket, now = Date.now()) {
  if (!secret || typeof ticket !== 'string' || ticket.length > 2048) return null;
  const [body,signature,extra] = ticket.split('.');
  if (!body || !/^[A-Za-z0-9_-]+$/.test(body) || !/^[A-Za-z0-9_-]{43}$/.test(signature || '') || extra) return null;
  const expected=crypto.createHmac('sha256',secret).update(body).digest('base64url');
  if (signature.length!==expected.length || !crypto.timingSafeEqual(Buffer.from(signature),Buffer.from(expected))) return null;
  try {
    const data=JSON.parse(Buffer.from(body,'base64url').toString());
    if(data.kind!=='voyage-avatar'||!(data.exp>now)||!data.userId||!/^([a-z0-9-]+\.webp)?$/.test(data.avatarKey))return null;
    return data;
  }catch{return null;}
}
module.exports={signVoyageAvatar,verifyVoyageAvatar};
