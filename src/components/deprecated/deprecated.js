class Items extends React.Component {
    render () {
        var itemArray = createItemArray();
        return (
            <div className="item-container">
            {itemArray.map(function(item, id) {
                var columnNum = counter % 3;
                var column = "item" + columnNum;
                counter++;
                if (id == itemArray.length - 1) {
                    counter = 0;
                }
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