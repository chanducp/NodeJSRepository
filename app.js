
console.log('starting password manager');
 
var crypto = require('crypto-js')
var storage = require('node-persist');
storage.initSync();

 
var argv = require('yargs')
    .command('create', 'Create a new account', function (yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Account name (eg: Twitter, Facebook)',
                type: 'string'
            },
            username: {
                demand: true,
                alias: 'u',
                description: 'Account username or email',
                type: 'string'
            },
            password: {
                demand: true,
                alias: 'p',
                description: 'Account password',
                type: 'string'
            },            
            masterpassword: {
                demand: true,
                alias: 'm',
                description: 'Master Password',
                type: 'string'
            }

        }).help('help');
    })
    .command('get', 'Get an existing account', function (yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Account name (eg: Twitter, Facebook)',
                type: 'string'
            },
            masterpassword: 
            {
                demand: true,
                alias: 'm',
                description: 'Master Password (eg: Twitter, Facebook)',
                type: 'string'
            }
        }).help('help');
    })
    .help('help')
    .argv;
var command = argv._[0];
 
// create
//     --name
//     --username
//     --password
 
// get
//     --name
 
// account.name Facebook
// account.username User12!
// account.password Password123!
 
function createAccount (account,masterpassword) 
{
   var accounts = getAccounts(masterpassword);
    accounts.push(account);

    var Encryptedaccount=crypto.AES.encrypt(JSON.stringify(accounts),masterpassword);

    storage.setItemSync('accounts', Encryptedaccount.toString());
    
    // if (typeof accounts === 'undefined') {
    //     accounts = [];
    // }
    // accounts.push(account);
    
    // storage.setItemSync('accounts', accounts);

    return account;
}

 

 
function getAccount (accountName,masterpassword) {

    
    // var accounts = storage.getItemSync('accounts');
     var accounts = getAccounts(masterpassword);
    var matchedAccount; 
    accounts.forEach(function (account) {
        if (account.name === accountName) 
        {
            matchedAccount = account;
        }
        
    });
 
    return matchedAccount;
}
if (command === 'create') {
    var createdAccount = createAccount({
        name: argv.name,
        username: argv.username,
        password: argv.password
    },argv.masterpassword);
    console.log('Account created!');
    console.log(createdAccount);
} else if (command === 'get') {
    var fetchedAccount = getAccount(argv.name,argv.masterpassword);
 
    if (typeof fetchedAccount === 'undefined') {
        console.log('Account not found');
    } else {
        console.log('Account found!');
        console.log(fetchedAccount);
    }
}

function getAccounts (masterPassword)
 {
    // use getItemSync to fetch accounts
    var encryptedAccount = storage.getItemSync('accounts');
    var accounts = [];
 
    // decrypt
    if (typeof encryptedAccount !== 'undefined') {
        var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
        accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }
 
    // return accounts array
    return accounts;
}

 
function saveAccounts (accounts, masterPassword)
 {
    // encrypt accounts
    var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
     
    // setItemSync
    storage.setItemSync('accounts', encryptedAccounts.toString());
     
    // return accounts
    return accounts;
}