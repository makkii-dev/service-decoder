const ABICoder = require('aion-web3-avm-abi')

const LEN_CHAR = 2
const LEN_SHORT = 2
const LEN_INT = 4
const LEN_LONG = 8
const LEN_FLOAT = 4
const LEN_DOUBLE = 8

const abi = new ABICoder()

/**
 * Decode contract call data
 * 
 * @param {string} data 
 * 
 * @returns {
 *      {string} method,
 *      {Array} params
 * }
 */
function decode_method(data){
    
    // console.log('data', data)
    let buf = Buffer.from(data, 'hex')
    let offset = 2

    let method_len = parseInt(buf[offset], 16)
    // console.log('[method_len]', method_len)
    offset +=1
    
    let method = buf.slice(offset, offset + method_len).toString('utf8')
    // console.log('    [method]', method_buf.toString('utf8'))
    offset += method_len

    // reset
    buf = buf.slice(offset, buf.length)

    let params = []
    while(buf.length > 0){
        let type = buf[0]
        switch(type){
            case 0x01:
                //console.log('case 0x01 byte', buf)
                params.push({
                    type: 'byte',
                    value: abi.decode('byte', buf)
                })
                buf = buf.slice(1 + 1, buf.length)
            break
            case 0x02:
                //console.log('case 0x02 boolean', buf)
                params.push({
                    type: 'boolean',
                    value: abi.decode('boolean', buf)
                })
                buf = buf.slice(1 + 1, buf.length)
            break
            case 0x03:
                //console.log('case 0x03 char', buf)
                params.push({
                    type: 'char',
                    value: abi.decode('char', buf)
                })
                buf = buf.slice(1 + 2, buf.length)
            break
            case 0x04:
                //console.log('case 0x04 short', buf)
                params.push({
                    type: 'short',
                    value: abi.decode('short', buf)
                })
                buf = buf.slice(1 + 2, buf.length)
            break
            case 0x05:
                //console.log('case 0x05 int', buf)
                params.push({
                    type: 'int',  
                    value: abi.decode('int', buf)
                })
                buf = buf.slice(1 + 4, buf.length)
            break
            case 0x06:
                //console.log('case 0x06 long', buf)
                params.push({
                    type: 'long',   
                    value: abi.decode('long', buf)
                })
                buf = buf.slice(1 + 8, buf.length)
            break
            case 0x07:
                //console.log('case 0x07 float', buf)
                params.push({
                    type: 'float',   
                    value: abi.decode('float', buf)
                })
                buf = buf.slice(1 + 4, buf.length)
            break
            case 0x08:
                //console.log('case 0x08 double', buf)
                params.push({
                    type: 'double',   
                    value: abi.decode('double', buf)
                })
                buf = buf.slice(1 + 8, buf.length)
            break
            case 0x11:
                //console.log('case 0x11 byte[]', buf)
                let bytes_len = parseInt(buf.slice(1, 3).toString('hex'), 16)
                params.push({
                    type: 'byte[]',   
                    value: abi.decode('byte[]', buf)
                })
                buf = buf.slice(1 + 2 + bytes_len, buf.length)
            break
            case 0x12:
                //console.log('case 0x12 boolean[]', buf)
                let boolean_len = parseInt(buf.slice(1, 3).toString('hex'), 16)
                params.push({
                    type: 'boolean[]',   
                    value: abi.decode('boolean[]', buf)
                })
                buf = buf.slice(1 + 2 + boolean_len, buf.length)
            break
            case 0x13:
                //console.log('case 0x13 char[]', buf)
                let chars_len = parseInt(buf.slice(1, 3).toString('hex'), 16)
                params.push({
                    type: 'char[]',   
                    value: abi.decode('char[]', buf)
                })
                buf = buf.slice(1 + 2 + chars_len * LEN_CHAR, buf.length)
            break
            case 0x14:
                //console.log('case 0x14 short[]', buf)
                let shorts_len = parseInt(buf.slice(1, 3).toString('hex'), 16)
                params.push({
                    type: 'short[]',   
                    value: abi.decode('short[]', buf)
                })
                buf = buf.slice(1 + 2 + shorts_len * LEN_SHORT, buf.length)
            break
            case 0x15:
                //console.log('case 0x15 int[]', buf)
                let ints_len = parseInt(buf.slice(1, 3).toString('hex'), 16)
                params.push({
                    type: 'int[]',   
                    value: abi.decode('int[]', buf)
                })
                buf = buf.slice(1 + 2 + ints_len * LEN_INT, buf.length)
            break
            case 0x16:
                //console.log('case 0x16 long[]', buf)
                let longs_len = parseInt(buf.slice(1, 3).toString('hex'), 16)
                params.push({
                    type: 'long[]',   
                    value: abi.decode('long[]', buf)
                })
                buf = buf.slice(1 + 2 + longs_len * LEN_LONG, buf.length)
            break
            case 0x17:
                //console.log('case 0x17 float[]', buf)
                let floats_len = parseInt(buf.slice(1, 3).toString('hex'), 16)
                params.push({
                    type: 'float[]',   
                    value: abi.decode('float[]', buf)
                })
                buf = buf.slice(1 + 2 + floats_len * LEN_FLOAT, buf.length)
            break
            case 0x18:
                //console.log('case 0x18 double[]', buf)
                let doubles_len = parseInt(buf.slice(1, 3).toString('hex'), 16)
                params.push({
                    type: 'double[]',   
                    value: abi.decode('double[]', buf)
                })
                buf = buf.slice(1 + 2 + doubles_len * LEN_DOUBLE, buf.length)
            break
            case 0x21:
                //console.log('case 0x21 string', buf)
                let string_len = parseInt(buf.slice(1, 3).toString('hex'), 16)
                params.push({
                    type: 'string',   
                    value: abi.decode('string', buf)
                })
                buf = buf.slice(1 + 2 + string_len, buf.length)
            break
            case 0x22:
                //console.log('case 0x22 address', buf)
                params.push({
                    type: 'address',   
                    value: abi.decode('address', buf).toLowerCase()
                })
                buf = buf.slice(1 + 32, buf.length)
            break
            case 0x23:
                //console.log('case 0x23 ', buf)
                let len = parseInt(buf[1])
                params.push({
                    type: 'biginteger',   
                    value: abi.decode('biginteger', buf)
                })
                buf = buf.slice(1 + 1 + len, buf.length)
            break
            case 0x31:
                let array_len = parseInt(buf.slice(2, 4).toString('hex'), 16)
                switch(buf[1]){
                    case 0x21:
                        //console.log('case 0x3121 string[]', buf)
                        let strings = abi.decode('string[]', buf)
                        params.push({
                            type: 'string[]',   
                            value: strings
                        })
                        let offset_21 = 4;
                        for(let i = 0; i < array_len; i++){
                            let buf_1 = buf.slice(offset_21 + 1, offset_21 + 3)
                            offset_21 += parseInt(buf_1.toString('hex'), 16) + 3
                        }
                        buf = buf.slice(offset_21, buf.length)
                    break
                    case 0x22:
                        //console.log('case 0x3122 address[]', buf)
                        let addresses = abi.decode('address[]', buf)
                        params.push({
                            type: 'address[]',   
                            value: addresses
                        })
                        buf = buf.slice(2 + 2 + (32 + 1) * array_len, buf.length)
                    break
                    case 0x23:
                        //console.log('case 0x3123 biginteger[]', buf)
                        let bigintegers = abi.decode('biginteger[]', buf)
                        params.push({
                            type: 'biginteger[]',
                            value: bigintegers
                        })
                        let offset_23 = 4;
                        for(let i = 0; i < array_len; i++){
                            let buf_1 = buf.slice(offset_23 + 1, offset_23 + 2)
                            offset_23 += parseInt(buf_1.toString('hex'), 16) + 3
                        }
                        buf = buf.slice(offset_23, buf.length)
                    break
                    default:
                    break
                }          
            break
            default:
                //console.log('unknown', type)
            break;
        }
    }
    return {
        method,
        params
    }
}

module.exports = {
    decode_method
}