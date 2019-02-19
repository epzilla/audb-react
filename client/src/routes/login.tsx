import { h, Component } from 'react';
import Rest from '../lib/rest-service';
import { Link } from 'react-router/match';
import LocalStorageService from '../lib/local-storage-service';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: null };
    if (props && props.user) {
      let redirect = props.returnUrl ? props.returnUrl : '';
      window.location.assign(`/${redirect}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      let redirect = this.props.returnUrl ? this.props.returnUrl : '';
      window.location.assign(`/${redirect}`);
    }
  }

  setValue = (e) => {
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  };

  submit = (e) => {
    e.preventDefault();
    Rest.post('session', this.state).then(user => {
      LocalStorageService.set('user', user);
      if (this.props.loginCb) {
        this.props.loginCb(user);
      }

      let redirct = (this.props && this.props.returnUrl) ? this.props.returnUrl : '';
      window.location.assign(`/${redirct}`);
    }).catch(err => {
      this.setState({ error: err });
    });
  };

  render() {
    let errBlock = this.state.error ? (
      <div className="form-group has-error">
        <p className="help-block">{ this.state. error }</p>
      </div>
    ) : null;

    return (
      <div className="main login">
        <h1>Login</h1>
        <form name="form" onSubmit={(e) => this.submit(e)}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" autofocus="autofocus" placeholder={this.props.config.loginPlaceholderEmail} className="form-control" onChange={this.setValue} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder={this.props.config.loginPlaceholderPW} className="form-control" onChange={this.setValue} />
          </div>
          { errBlock }
          <button type="submit" className="btn primary"> Sign in </button><span className="clearfix"></span>
        </form>
        <div className="row pad-mobile">
            <hr/>
            Not registered? <Link href="/sign-up" className="text-center new-account">Create an account.</Link>
        </div>
      </div>
    );
  }
}
