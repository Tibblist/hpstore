import React from 'react';
import '../../css/store.css';
var counter = 0;
export default class Store extends React.Component {
    render() {
        return (
            <div>
                This is the store.
                <Items></Items>
            </div>
        );
    }
}

class Items extends React.Component {
    render () {
        return (
            <div className="item-container">
            {createItemArray().map(function(item, id) {
                console.log(id);
                console.log(item);
                var column = "item" + counter;
                counter++;
                if (counter == 3) {
                    counter = 0;
                }
                return <li className={column} key={id}>{item[1]}</li>
            })}
            </div>
        );
    }
}

function createItemArray() {
    var itemArray = [];
    for (var i = 0; i < 10; i++) {
        var item = [];
        item.push(i);
        item.push("Naglfar");
        item.push("1.2B");
        item.push("IMAGE URL HERE");
        itemArray.push(item);
    }
    return itemArray;
}