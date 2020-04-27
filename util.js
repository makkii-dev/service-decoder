const { execSync } = require('child_process')

function is_hex(value){
    return typeof value === 'string' && /^(-0x|0x)?[0-9a-f]+$/i.test(value) === true;
}

function format_hex(str){
    if (is_hex(str)) {
        str = str.toLowerCase();
        str = str.startsWith('0x') ? str.slice(2) : str;
        return str;
    } else {
        throw Error('input must be a hex string');
    }
}

function to_hex(value) {
    if (!value) 
        return '0x'
    switch(typeof value){
        case 'string': return format_hex(value)
        case 'number': return format_hex(value.toString(16))
        case 'object': 
            if (value instanceof Buffer) 
                return format_hex(value.toString('hex'))
            else if (value instanceof Uint8Array) 
                return format_hex(Buffer.from(value).toString('hex'))
            else if (_bignumber["default"].isBigNumber(value)) 
                return format_hex(value.toString(16))
        default: 
            throw value
    }
}

function hex_to_array(hex) {
    hex = hex.startsWith('0x') ? hex.substring(2) : hex
    let array = [];
    while (hex.length >= 2) {
        array.push(parseInt(hex.substring(0, 2), 16));
        hex = hex.substring(2, hex.length);
    }
    return array;
}

function cmd_sync(cmd) {
    try {
        let buf = execSync(
            cmd, 
            {
                shell: true,
                encoding: 'utf-8',
                timeout: 5000,
                stdio:[0]
            }
        )
        let json = JSON.parse(buf)
        return {
            result: json
        } 
    } catch (e) {
        return {
            error: e.toString()
        }
    }
}

module.exports = {
    format_hex,
    to_hex,
    hex_to_array,
    cmd_sync
}