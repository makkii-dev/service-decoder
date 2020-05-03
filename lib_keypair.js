const BN = require('bn.js')
const nacl = require('tweetnacl')
const blake2b = require('blake2b')
const rlp = require('aion-rlp')
const util = require('./lib_util.js')
const AION_IDENTIFIER = 0xa0

/**
 * Generate keypair from private key
 * 
 * @param {string} private_key 
 * 
 * @returns {
 *      {string} private_key,       // no 0x prefix
 *      {string} public_key,        // no 0x prefix
 *      {string} address            // no 0x prefix
 * }
 */
function from_private_key(private_key) {
    const buf = Buffer.from(private_key, 'hex')
    const pair = nacl.sign.keyPair.fromSeed(buf)
    const hash = blake2b(32).update(pair.publicKey).digest()
    hash[0] = AION_IDENTIFIER
    return {
        private_key, 
        public_key: Buffer.from(pair.publicKey).toString('hex'), 
        address: Buffer.from(hash).toString('hex')
    }
}

/**
 * Sign transaction with private key
 * 
 * @param {string} private_key 
 * @param {string} public_key 
 * @param {object} tx {
 *      {BN} nonce,
 *      {string} to,              // 0x ...
 *      {BN} amount,
 *      {string} data,            // 0x ...
 *      {number} timestamp,
 *      {BN} gasLimit,
 *      {BN} gasPrice,
 *      {BN} type,        
 * }
 * 
 * @returns {
 *      {string} tx,              // signed tx as hex string including full signature
 *      {string} signature        // full signature as hex string
 * } 
 */
function sign(private_key, public_key, tx){

    let array = [
        tx.nonce,
        tx.to,
        tx.amount,
        tx.data,
        tx.timestamp,
        new rlp.AionLong(tx.gasLimit),
        new rlp.AionLong(tx.gasPrice),
        new rlp.AionLong(tx.type)
    ]
    let tx_rlped = rlp.encode(array)
    // console.log('[sign/tx_rlped]', tx_rlped.toString('hex'), '\n')

    let digest = blake2b(32).update(tx_rlped).digest()
    let key = Buffer.from(private_key + public_key, 'hex')
    let signature_buffer = Buffer.from(nacl.sign.detached(digest, key))
    signature_buffer = Buffer.concat([
        Buffer.from(public_key, 'hex'), 
        signature_buffer
    ])

    let signature = signature_buffer.toString('hex')
    tx = rlp.encode(rlp.decode(tx_rlped).concat(signature)).toString('hex')
    // console.log('[sign/signature]', signature, '\n')

    return {
        tx,
        signature
    }
}

/**
 * Unsign raw transaction
 * 
 * @param {string} signed 
 */
function unsign(signed){
    let array = rlp.decode(Buffer.from(signed, 'hex'))
    let nonce = new BN(array[0]),
        to = util.format_hex(array[1].toString('hex')),
        amount = new BN(array[2]),
        data = array[3].toString('hex'),
        timestamp = parseInt(array[4].toString('hex'), 16),
        gasLimit = new BN(array[5]),
        gasPrice = new BN(array[6]),
        type = new BN(array[7])

    return {
        nonce,
        to,
        amount,
        data,
        timestamp,
        gasLimit,
        gasPrice,
        type
    }
}

module.exports = {
    from_private_key,
    sign,
    unsign
}