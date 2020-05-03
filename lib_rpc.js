const { execSync } = require('child_process')

const CURL = 'curl -X POST http://47.92.202.146:8545 -H "Content-Type: application/json" -d [json]'

/**
 * Synchromized execution
 * 
 * @param {string} cmd
 * 
 * @returns {object}
 */
function cmd_sync(cmd) {
    return JSON.parse(execSync(cmd, { shell: true, encoding: 'utf-8', timeout: 5000, stdio:[0]})) 
}

/**
 * Get transaction count
 * 
 * @param {string} address
 * 
 * @returns {string}  
 */
function get_transaction_count(address){
    let curl = CURL.replace('[json]', '\'' + JSON.stringify({ id: 0, jsonrpc: '2.0', method: 'eth_getTransactionCount', params:['0x' + address] }) + '\'')
    console.log('[rpc/get_transaction_count]', curl, '\n')
    return cmd_sync(curl).result
}

/**
 * Send raw transaction
 * 
 * @param {string} signed
 * 
 * @returns {object} 
 */
function send_raw_transaction(signed){
    let curl = CURL.replace('[json]', '\'' + JSON.stringify({ id: 0, jsonrpc: '2.0', method: 'eth_sendRawTransaction', params:['0x' + signed] }) + '\'')
    console.log('[rpc/send_raw_transaction]', curl, '\n')
    return cmd_sync(curl_send).result
}

module.exports = {
    get_transaction_count,
    send_raw_transaction
}