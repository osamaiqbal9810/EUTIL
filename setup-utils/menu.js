const rl = require("readline-sync");
const cTable = require('console.table');
const chalk = require("chalk");
const boxen = require("boxen");

makeMenuObject = function(menu)
{           
    let menuToDisplay = JSON.parse(JSON.stringify(menu));
    return menuToDisplay.map((v, i)=>{return {option: i, item: v.item}});
}
makeMainMenuObject = function(menu)
{
    let menuItems = makeMenuObject(menu);
    menuItems.push({option:""+menuItems.length, item:"Exit" });
    return menuItems;
}
makeSubMenuObject = function(menu)
{
    let menuItems = makeMenuObject(menu);
    menuItems.push({option:""+menuItems.length, item:"back"});
    return menuItems;
}
function stringifyItems(items)
{
    let str ="";
    
    for(let k of Object.keys(items))
     str+=(items[k]+"        ");

     return str;
}
function maxWidth(table)
{
    let max=0;
    for(let item of table)
    {
        let len=stringifyItems(item).length;
        if(max<len)max=len;
    }
    return max;
}
function boxStart(width)
{
    return "╔"+"═".repeat(width-2)+"╗";
}
function boxEnd(width)
{
    return "╚"+"═".repeat(width-2)+"╝";
}
function wrapDisplayItem(item, width, start)
{
    let diff = width - item.length;
    //let diffTolerance = width-item.length-2-diff*2;
    //console.log('width, length, diff', width, item.length, diff);

    return "║"+" ".repeat(start) + item + " ".repeat(diff+3)+"║";
}
function displayTable(table)
{
    let keys = Object.keys(table[0]); // take the keys from the first item. pretend that all items will have same keys
    let width = maxWidth(table) + 20;
    
    console.log(boxStart(width));
    console.log(wrapDisplayItem(chalk.blue(stringifyItems(keys)), width, 5));
    for(let item of table)
    {   
        let str = keys.map((k)=>{return item[k];});
        console.log(wrapDisplayItem(chalk.green(stringifyItems(str)), width, 5));
    }
    console.log(boxEnd(width));
}

module.exports = async function displayMenu(menu, submenu=false)
{
    if(menu && menu.length)
    {      let exit=false;
           while(!exit) 
           {
            if(submenu)
            { 
                //console.table(makeSubMenuObject(menu));
                displayTable(makeSubMenuObject(menu));
            }
            else
            {
                //console.table(makeMainMenuObject(menu));
                displayTable(makeMainMenuObject(menu));
            }



            let answer = parseInt(rl.question('Enter the option:')); 
                
                if(answer<menu.length)
                {
                    let menuItem = menu[answer];
                    //console.log('you entered:', answer, menuItem);
                    if(menuItem.func)
                    {
                        //console.log('executing function');
                        await menuItem.func();
                    }
                    else if(menuItem.submenu && menuItem.submenu.length)
                    {
                        displayMenu(menuItem.submenu, true);
                    }
                }
                else if(answer===menu.length)
                {
                  exit=true;
                }
           }
    }
}