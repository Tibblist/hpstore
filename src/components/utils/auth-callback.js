import { withRouter } from 'react-router-dom';
import queryString from 'query-string';

class ActivateAccount extends Component{
    someFunction(){
        let params = queryString.parse(this.props.location.search)

    }

}
export default withRouter(ActivateAccount);