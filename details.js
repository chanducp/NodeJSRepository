var storage=require('node-persist');
storage.initSync();
storage.setItemSync('accounts',[{

    username:'PC',
    balance:100
},
{

    username:'CP',
    balance:200
}
]);

var accounts=storage.getItemSync('accounts');

//pushing new account
accounts.push({
    username:'PCPC',
    balance:500
});

//save using setItemSync
storage.setItemSync('accounts',accounts);
console.log(accounts);


