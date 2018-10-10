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
                var columnNum = counter % 3;
                var column = "item" + columnNum;
                counter++;
                return <li className={column} key={id}>{item[1]}</li>
            })}
            </div>
        );
    }
}

function createItemArray() {
    var itemArray = [];
    for (var i = 0; i < 10; i++) {
        var item = [i, "naglfar", "1.2B", "https://wiki.eveuniversity.org/images/thumb/f/f9/Naglfar.jpg/256px-Naglfar.jpg"];
        itemArray.push(item);
    }
    return itemArray;
}