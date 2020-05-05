const ABICoder = require('aion-web3-avm-abi')
const BN = require('bn.js')
const BigNumber = require('bignumber.js')
// const keypair = require('./lib_keypair.js')
const keypair = require('lib-keypair')
const rpc = require('./lib_rpc.js')

const CONTRACT = '0xa0b28ca59300440597de68db37e8cf9021fa7a5cef9ed7eee5e878241520a2aa'
const PRIVATE = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

const abi = new ABICoder()

let byte = 0,
    boolean = true,
    char = 'z',
    short = Math.pow(2, 15)  - 1,
    // short = -Math.pow(2, 15),
    int = Math.pow(2, 31) - 1,                  // 2147483647
    // int = -Math.pow(2, 31),
    long = Math.pow(2, 53) - 1,                 // 9007199254740991, java Math.pow(2, 63) - 1
    // long = -(Math.pow(2, 53) - 1),           // java -Math.pow(2, 63)
    float = -99.5,                              // TODO: -99.99 
    double = -99.99999999,                      // TODO:
    string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    address = "0xa00123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd",
    biginteger = new BigNumber(256),

    array_byte = Buffer.from("0123456789abcdef", 16),
    array_boolean = [true, false, false, true],
    array_char = [
        '0','1','2','3','4','5','6','7','8','9',
        'a','b','c','d','e','f','g','h','i','j',
        'k','l','m','n','o','p','q','r','s','t',
        'u','v','w','x','y','z'
    ],
    array_short = [short, 0, -short],
    array_int = [int, 0, -int],
    array_long = [long, 0, -long],
    array_float = [float, 0, -float],
    array_double = [double, 0, -double],
    array_string = ["a1234567890", "0abcdefghijklmnopqrstuvwxyz", "1234567890abcdefghijklmnopqrstuvwxyz"],
    array_address = [
        "0xa00123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd",
        "0xa0abcdef0123456789abcdef0123456789abcdef0123456789abcd0123456789"
    ],
    array_biginteger = [new BigNumber(0), new BigNumber(255), new BigNumber(256)]

let k = keypair.from_private_key('aion', PRIVATE)
console.log('[build_raw_transaction/private_key]', k.private_key)
console.log('[build_raw_transaction/public_key]', k.public_key)
console.log('[build_raw_transaction/address]', k.address, '\n')

let nonce = new BN(rpc.get_transaction_count(k.address).replace('0x',''), 16)
let to = CONTRACT
let data = abi.encodeMethod(
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
let timestamp = new Date().getTime() * 1000
let amount = new BN(0)
let gasPrice = new BN(10000000000)
let gasLimit = new BN(2000000)
let type = new BN(1)

let tx = {
    nonce,
    to,
    data,
    timestamp,
    amount,
    gasPrice,
    gasLimit,
    type
}

console.log('[build_raw_transaction/raw]', k.sign(tx), '\n')