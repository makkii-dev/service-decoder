const ABICoder = require('aion-web3-avm-abi')
const BigNumber = require('bignumber.js')
const BN = require('bn.js')
const keypair = require('./keypair.js')
const util = require('./util.js')

const CONTRACT = '0xa0b28ca59300440597de68db37e8cf9021fa7a5cef9ed7eee5e878241520a2aa'
const PRIVATE = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
const CURL = 'curl -X POST http://47.92.202.146:8545 -H "Content-Type: application/json" -d {json}'

const abi = new ABICoder()

let value = 0
let byte = 0x00,
    boolean = true,
    char = 'z',
    short = Math.pow(2, 15)  - 1,
    // short = -Math.pow(2, 15),
    int = Math.pow(2, 31) - 1,
    // int = -Math.pow(2, 31),
    long = Math.pow(2, 53) - 1,                 // java Math.pow(2, 63) - 1
    // long = -(Math.pow(2, 53) - 1),           // java -Math.pow(2, 63)
    float = -99.99999999,                       // TODO: 
    double = -99.99999999,                      // TODO:
    string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    address = "0xa00123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd",
    biginteger = new BigNumber(1),

    array_byte = Buffer.from("0123456789abcdef", 16),
    array_boolean = [true, false],
    array_char = [
        '0','1','2','3','4','5','6','7','8','9',
        'a','b','c','d','e','f','g','h','i','j',
        'k','l','m','n','o','p','q','r','s','t',
        'u','v','w','x','y','z'
    ],
    array_short = [short, 0, short],
    array_int = [int, 0, int],
    array_long = [long, 0, long],
    array_float = [float],
    array_double = [double],
    array_string = [string],
    array_address = [address],
    array_biginteger = [biginteger]

console.log('        byte', byte)
console.log('     boolean', boolean)
console.log('        char', char)
console.log('       short', short)
console.log('         int', int)
console.log('        long', long)
console.log('       float', float)
console.log('      double', double)
console.log('      string', string)
console.log('     address', address)
console.log('  biginteger', biginteger)
console.log('      byte[]', array_byte)
console.log('   boolean[]', array_boolean)
console.log('      char[]', array_char)
console.log('     short[]', array_short)
console.log('       int[]', array_int)
console.log('      long[]', array_long)
console.log('     float[]', array_float)
console.log('    double[]', array_double)
console.log('    string[]', array_string)
console.log('   address[]', array_address)
console.log('biginteger[]', array_biginteger)
console.log()

let k = keypair.from_private_key(PRIVATE)
console.log('[keypair]', k, '\n')

let curl_nonce = CURL.replace(
    "{json}",
    '\'' + JSON.stringify({ id: 0, jsonrpc: '2.0', method: 'eth_getTransactionCount', params:['0x' + k.address] }) + '\''
)
console.log('[curl_nonce]', curl_nonce, '\n')

let nonce = util.cmd_sync(curl_nonce).result.result
console.log('[nonce]', nonce, '\n')

const data = abi.encodeMethod(
    'types',
    [
        'byte',   'boolean',   'char',   'short',   'int',   'long',   'float',   'double',   'string',   'address',   'biginteger',
        'byte[]', 'boolean[]', 'char[]', 'short[]', 'int[]', 'long[]', 'float[]', 'double[]', 'string[]', 'address[]', 'biginteger[]'
    ],
    [
              byte,       boolean,       char,       short,       int,       long,       float,double,              string,       address,       biginteger,
        array_byte, array_boolean, array_char, array_short, array_int, array_long, array_float, array_double, array_string, array_address, array_biginteger
    ]
)

let tx_unsigned = {
    nonce,
    to: CONTRACT,
    data,
    timestamp: 1587963298418000,                   // new Date().getTime() * 1000,
    amount: '0x' + new BN(value).toString('hex'),
    gasPrice: new BN('10000000000', 10),
    gasLimit: new BN('2000000', 10),
    type: new BN(1)
}

const signed = keypair.sign(k.private_key, k.public_key, tx_unsigned)
console.log('[signed]', signed, '\n')

let curl_send = CURL.replace(
    "{json}",
    '\'' + JSON.stringify({ id: 0, jsonrpc: '2.0', method: 'eth_sendRawTransaction', params:['0x' + signed.raw.toString('hex')] }) + '\''
)
console.log('[curl_send]', curl_send, '\n')

let send = util.cmd_sync(curl_send)
console.log('send', send)