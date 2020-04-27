const nacl = require('tweetnacl')
const BN = require('bn.js')
const blake2b = require('blake2b')
const rlp = require('aion-rlp')
const util = require('./util.js')

const AION_IDENTIFIER = 0xa0

function from_private_key(private_key_string) {
    const buf = Buffer.from(util.format_hex(private_key_string), 'hex')
    const pair = nacl.sign.keyPair.fromSeed(buf)
    const hash = blake2b(32).update(pair.publicKey).digest()
    hash[0] = AION_IDENTIFIER
    return {
        private_key: private_key_string, // util.to_hex(pair.secretKey), 
        public_key: util.to_hex(pair.publicKey), 
        address: util.to_hex(hash)
    }
}

function sign(private_key, public_key, tx_unsigned){

    let pre_rlp = [
        tx_unsigned.nonce,
        tx_unsigned.to,
        tx_unsigned.amount,
        tx_unsigned.data,
        tx_unsigned.timestamp,
        new rlp.AionLong(tx_unsigned.gasLimit),
        new rlp.AionLong(tx_unsigned.gasPrice),
        new rlp.AionLong(tx_unsigned.type)
    ]

    console.log('[keypair/pre_rlp]', pre_rlp, '\n')

    let rlped = rlp.encode(pre_rlp)
    console.log('[keypair/rlped]', rlped instanceof Buffer ? 'Buffer' : 'object', rlped.toString('hex'), '\n')

    let raw_hash = blake2b(32).update(rlped).digest()
    console.log('[keypair/raw_hash]', raw_hash instanceof Uint8Array ? 'Uint8Array' : 'object', raw_hash.toString('hex'), '\n')

    console.log('!!! private_key', Buffer.from(private_key).length)
    console.log('!!! public_key', Buffer.from(public_key).length)

    let signature = Buffer.from(nacl.sign.detached(raw_hash, Buffer.from(private_key + public_key)))

    console.log(signature)

    // verify signature
    if (nacl.sign.detached.verify(raw_hash, signature, Buffer.from(util.hex_to_array(private_key))) === false) {
        throw new Error('Could not verify signature.');
    }    



    let signature_full = Buffer.concat([
        Buffer.from(util.hex_to_array(public_key)), 
        signature
    ])

    return {
        raw: rlp.encode(rlp.decode(rlped).concat(signature_full)),
        signature: util.to_hex(signature)
    }
}

module.exports = {
    from_private_key,
    sign
}