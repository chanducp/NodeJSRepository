1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
141
142
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
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Master password',
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
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Master password',
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
 
function getAccounts (masterPassword) {
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
 
function saveAccounts (accounts, masterPassword) {
    // encrypt accounts
    var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
     
    // setItemSync
    storage.setItemSync('accounts', encryptedAccounts.toString());
     
    // return accounts
    return accounts;
}
 
function createAccount (account, masterPassword) {
    var accounts = getAccounts(masterPassword);
 
    accounts.push(account);
 
    saveAccounts(accounts, masterPassword);
 
    return account;
}
 
function getAccount (accountName, masterPassword) {
    var accounts = getAccounts(masterPassword)
    var matchedAccount;
 
    accounts.forEach(function (account) {
        if (account.name === accountName) {
            matchedAccount = account;
        }
    });
 
    return matchedAccount;
}
 
if (command === 'create') {
    try {
        var createdAccount = createAccount({
            name: argv.name,
            username: argv.username,
            password: argv.password
        }, argv.masterPassword);
        console.log('Account created!');
        console.log(createdAccount);
    } catch (e) {
        console.log('Unable to create account.');
    }
} else if (command === 'get') {
    try {
        var fetchedAccount = getAccount(argv.name, argv.masterPassword);
 
        if (typeof fetchedAccount === 'undefined') {
            console.log('Account not found');
        } else {
            console.log('Account found!');
            console.log(fetchedAccount);
        }
    } catch (e) {
        console.log('Unable to fetch account.');
    }
}