import React from 'react';

export class DropDownButton extends React.Component {
    constructor(props){
        super(props);
        this.toggleList = this.toggleList.bind(this);
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
        const{list, toggleItem} = this.props;
        const props = this.props;
        const{listOpen} = this.state;
        return (
            <div className="dd-wrapper">
                <div className="dd-header" onClick={this.toggleList}>
                    <div className="dd-header-title">{getHeaderTitle(props)}</div>
                </div>
                {listOpen && <ul className="dd-list">
                    {list.map((item) => (
                        itemStyle(item, toggleItem)
                    ))}
                </ul>}
            </div>
        );
    }
}

function getHeaderTitle(props) {
    const count = props.list.filter(function(a) { return a.selected; }).length;
    
    if(count === 0){
        return props.titleHelper;
    }
    else if(count === 1){
        return props.titleHelper + ' (' + count + ')';
    }
    else if(count > 1){
        return props.titleHelper + ' (' + count + ')';
    }
}

function itemStyle(item, toggleItem) {
    if (item.selected === true) {
        return <li className="dd-list-item-selected" key={item.id} onClick={() => toggleItem(item.id, item.key)}>{item.title} &#10004;</li>
    } else {
        return <li className="dd-list-item" key={item.id} onClick={() => toggleItem(item.id, item.key)}>{item.title}</li>
    }
}