import React from 'react';
import StoreHeader from './store-header';
import '../../css/store.css';
var counter = 0;
export default class Store extends React.Component {
    render() {
        return (
            <div>
                <StoreHeader></StoreHeader>
                <Items></Items>
                <SideMenu></SideMenu>
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
                return <p className={column} key={id}><div className="item">
                <div className="item-image"><img src={item[3]} alt={item[1]}></img></div>
                <div className="item-name">{item[1]}</div>
                <div className="item-price">{item[2]}</div>
                </div></p>
            })}
            </div>
        );
    }
}

class SideMenu extends React.Component {
    constructor(){
        super()
        this.state = {
          capitals: [
            {
                id: 0,
                title: 'All',
                selected: false,
                key: 'capitals'
            },
            {
              id: 1,
              title: 'Amarr',
              selected: false,
              key: 'capitals'
            },
            {
              id: 2,
              title: 'Caldari',
              selected: false,
              key: 'capitals'
            },
            {
              id: 3,
              title: 'Gallente',
              selected: false,
              key: 'capitals'
            },
            {
              id: 4,
              title: 'Minmatar',
              selected: false,
              key: 'capitals'
            },
            {
              id: 5,
              title: 'Faction',
              selected: false,
              key: 'capitals'
            }
          ],
          supercapitals: [
            {
                id: 0,
                title: 'All',
                selected: false,
                key: 'supercapitals'
            },
            {
              id: 1,
              title: 'Amarr',
              selected: false,
              key: 'supercapitals'
            },
            {
              id: 2,
              title: 'Caldari',
              selected: false,
              key: 'supercapitals'
            },
            {
              id: 3,
              title: 'Gallente',
              selected: false,
              key: 'supercapitals'
            },
            {
              id: 4,
              title: 'Minmatar',
              selected: false,
              key: 'supercapitals'
            },
            {
              id: 5,
              title: 'Faction',
              selected: false,
              key: 'supercapitals'
            }
          ],
          fullfits: [
            {
                id: 0,
                title: 'All',
                selected: false,
                key: 'fullfits'
            },
            {
              id: 1,
              title: 'Amarr',
              selected: false,
              key: 'fullfits'
            },
            {
              id: 2,
              title: 'Caldari',
              selected: false,
              key: 'fullfits'
            },
            {
              id: 3,
              title: 'Gallente',
              selected: false,
              key: 'fullfits'
            },
            {
              id: 4,
              title: 'Minmatar',
              selected: false,
              key: 'fullfits'
            },
            {
              id: 5,
              title: 'Faction',
              selected: false,
              key: 'fullfits'
            }
          ],
        }
    }

    toggleSelected(id, key){
        let temp = this.state[key]
        temp[id].selected = !temp[id].selected
        this.setState({
          [key]: temp
        })
    }
    
    render() {
        return (
            <div className="sidenav">
                <ul>
                    <DropDownButton
                        title="Capitals"
                        list={this.state.capitals}
                    />
                    <DropDownButton
                        title="Supercapitals"
                        list={this.state.supercapitals}
                    />
                </ul>
            </div>
        );
    }
}

class DropDownButton extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          listOpen: false,
          headerTitle: this.props.title
        }
    }
    handleClickOutside(){
        this.setState({
          listOpen: false
        })
    }
      
    toggleList(){
        this.setState(prevState => ({
          listOpen: !prevState.listOpen
        }))
    }

    render() {
        const{list} = this.props;
        const{listOpen, headerTitle} = this.state;
        return (
            <div className="dd-wrapper">
                <div className="dd-header" onClick={this.toggleList.bind(this)}>
                    <div className="dd-header-title">{headerTitle}</div>
                </div>
                {listOpen && <ul className="dd-list">
                    {list.map((item) => (
                        <li className="dd-list-item" key={item.id} >{item.title}</li>
                    ))}
                </ul>}
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