const util = require('util')
const keypair = require('lib-keypair')
const contract = require('lib-contract')

let array = process.argv[2].split("=")
switch(array[0]){
    case "raw":
        let unsigned = keypair.unsign('aion', array[1])
        console.log('[unsigned]', unsigned, '\n')
    break
    case "data":
        let details = contract.decode('aion', array[1])
        console.log('[data]', util.inspect(details, {showHidden: false, depth: null}), '\n')
    break
    default: 
        console.log("unknown input")
    break
}