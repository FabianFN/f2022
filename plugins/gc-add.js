let { generateWAMessageFromContent, prepareWAMessageMedia, proto } = (await import('@adiwajshing/baileys')).default
import fetch from 'node-fetch'
const { getBinaryNodeChild, getBinaryNodeChildren } = (await import('@adiwajshing/baileys')).default
let handler = async (m, { conn, text, participants, args }) => {  
if (!global.db.data.settings[conn.user.jid].restrict) throw '*[ β οΈ ] π΄π» πΎππ½π΄π ππΈπ΄π½π΄ ππ΄ππππΈπ½πΆπΈπ³πΎ (ππππππ ππππππππ / πππππππ ππππππππ) π΄π» πππΎ π³π΄ π΄πππ΄ π²πΎπΌπ°π½π³πΎ*'
if (!args[0]) throw '*[β] πΈπ½πΆππ΄ππ΄ π΄π» π½ππΌπ΄ππΎ π³π΄π» ππππ°ππΈπΎ πππ΄ π³π΄ππ΄π΄ π°πΆππ΄πΆπ°π*'    
try {    
let _participants = participants.map(user => user.id)
let users = (await Promise.all(
text.split(',')
.map(v => v.replace(/[^0-9]/g, ''))
.filter(v => v.length > 4 && v.length < 20 && !_participants.includes(v + '@s.whatsapp.net'))
.map(async v => [v, await conn.onWhatsApp(v + '@s.whatsapp.net')]))).filter(v => v[1][0]?.exists).map(v => v[0] + '@c.us')
const response = await conn.query({ tag: 'iq', attrs: { type: 'set', xmlns: 'w:g2', to: m.chat }, content: users.map(jid => ({ tag: 'add', attrs: {}, content: [{ tag: 'participant', attrs: { jid } }]}))})
const pp = await conn.profilePictureUrl(m.chat).catch(_ => null)
const jpegThumbnail = pp ? await (await fetch(pp)).buffer() : Buffer.alloc(0)
const add = getBinaryNodeChild(response, 'add')
const participant = getBinaryNodeChildren(add, 'participant')
for (const user of participant.filter(item => item.attrs.error == 403)) {
const jid = user.attrs.jid
const content = getBinaryNodeChild(user, 'add_request')
const invite_code = content.attrs.code
const invite_code_exp = content.attrs.expiration
let teks = `*[βππππβ] π½πΎ π΅ππ΄ πΏπΎππΈπ±π»π΄ π°π½Μπ°π³πΈπ π° @${jid.split('@')[0]}, π΄πππΎ πΏππ΄π³π΄ πΎπ²ππππΈπ πΏπΎππππ΄ π΄π» π½ππΌπ΄ππΎ π΄πππ΄ πΈπ½π²πΎπππ΄π²ππΎ, π»π° πΏπ΄πππΎπ½π° ππ΄ π·π°ππ° ππ°π»πΈπ³πΎ ππ΄π²πΈπ΄π½ππ΄πΌπ΄π½ππ΄ π³π΄π» πΆπππΏπΎ πΎ π»π° πΏπ΄πππΎπ½π° π·π°ππ° π²πΎπ½π΅πΈπΆπππ°π³πΎ ππ πΏππΈππ°π²πΈπ³π°π³ π³π΄ πΆπππΏπΎπ, ππ΄ π»π΄ π΄π½ππΈπΎ π»π° πΈπ½ππΈππ°π²πΈπΎπ½ π°π» πΆπππΏπΎ π΄π½ ππ πΏππΈππ°π³πΎ π°π» ππππ°ππΈπΎ*`
m.reply(teks, null, { mentions: conn.parseMention(teks)})
let captionn = `Hey!! Hola, me presento, soy FNBot, y soy un Bot para WhatsApp, una persona del grupo utilizo el comando para aΓ±adirte al grupo, pero no pude agregarte, asi que te mando la invitacion para que te unas, te esperamos!!`    
var messaa = await prepareWAMessageMedia({ image: jpegThumbnail }, { upload: conn.waUploadToServer })
var groupInvite = generateWAMessageFromContent(m.chat, proto.Message.fromObject({ groupInviteMessage: { groupJid: m.chat, inviteCode: invite_code, inviteExpiration: invite_code_exp, groupName: await conn.getName(m.chat), caption: captionn, jpegThumbnail: jpegThumbnail }}), { userJid: jid })
await conn.relayMessage(jid, groupInvite.message, { messageId: groupInvite.key.id })}
} catch {
throw '*[βππππβ] π½πΎ π΅ππ΄ πΏπΎππΈπ±π»π΄ π°π½Μπ°π³πΈπ π΄π» π½ππΌπ΄ππΎ πππ΄ πΈπ½πΆππ΄ππΎ, π΄πππΎ πΏππ΄π³π΄ πΎπ²ππππΈπ πΏπΎππππ΄ π΄π» π½ππΌπ΄ππΎ π΄πππ΄ πΈπ½π²πΎπππ΄π²ππΎ, π»π° πΏπ΄πππΎπ½π° ππ΄ π·π°ππ° ππ°π»πΈπ³πΎ ππ΄π²πΈπ΄π½ππ΄πΌπ΄π½ππ΄ π³π΄π» πΆπππΏπΎ πΎ π»π° πΏπ΄πππΎπ½π° π·π°ππ° π²πΎπ½π΅πΈπΆπππ°π³πΎ ππ πΏππΈππ°π²πΈπ³π°π³ π³π΄ πΆπππΏπΎπ, ππ΄ π°π²πΎπ½ππ΄πΉπ°πΌπΎπ π΄π½ππΈπ°π»π΄ π»π° πΈπ½ππΈππ°π²πΈπΎπ½ πΌπ°π½ππ°π»πΌπ΄π½ππ΄!!*'
}}
handler.help = ['add', '+'].map(v => v + ' nΓΊmero')
handler.tags = ['group']
handler.command = /^(add|agregar|aΓ±adir|\+)$/i
handler.admin = handler.group = handler.botAdmin = true
export default handler
