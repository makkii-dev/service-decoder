const util = require('util')
const keypair = require('./lib_keypair.js')
const contract = require('./lib_contract.js')

let array = process.argv[2].split("=")
switch(array[0]){
    case "raw":
        let raw = array[1]
        console.log('[raw]', raw, '\n')
        let unsigned = keypair.unsign(raw)
        console.log('[unsigned]', unsigned, '\n')
    break
    case "data":
        let data = array[1]
        console.log('[data]', data, '\n')
        let call = contract.decode_method(data)
        console.log('[call]', util.inspect(call, {showHidden: false, depth: null}), '\n')
    break
    default: 
        console.log("unknown input")
    break
}