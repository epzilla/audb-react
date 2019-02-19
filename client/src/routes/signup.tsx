import { h, Component } from 'react';
import Rest from '../lib/rest-service';
import { route } from 'react-router';
import { Link } from 'react-router/match';
import LocalStorageService from '../lib/local-storage-service';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', email: '', password: '', error: null };
    if (props && props.user) {
      let redirect = props.returnUrl ? props.returnUrl : '';
      route(`/${redirect}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      let redirect = this.props.returnUrl ? this.props.returnUrl : '';
      route(`/${redirect}`);
    }
  }

  setValue = (e) => {
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  };

  submit = (e) => {
    e.preventDefault();
    Rest.post('users', this.state).then(user => {
      LocalStorageService.set('user', user);
      if (this.props.loginCb) {
        this.props.loginCb(user);
      }

      let redirct = (this.props && this.props.returnUrl) ? this.props.returnUrl : '';
      route(`/${redirct}`);
    }).catch(err => {
      this.setState({ error: err });
    });
  };

  render() {
    let errBlock = this.state.error ? (
      <div className="form-group has-error">
        <p className="help-block">Hmmm... either your email or password isn't right. Please try again.</p>
      </div>
    ) : null;

    return (
      <div className="main login">
        <h1>Sign Up</h1>
        <form name="form" onSubmit={(e) => this.submit(e)}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" autofocus="autofocus" placeholder={this.props.config.signupPlaceholderName} className="form-control" onChange={this.setValue} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" placeholder={this.props.config.signupPlaceholderEmail} className="form-control" onChange={this.setValue} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" placeholder={this.props.config.signupPlaceholderPW} className="form-control" onChange={this.setValue} />
          </div>
          { errBlock }
          <button type="submit" className="btn primary"> Sign Up </button><span className="clearfix"></span>
        </form>
        <div className="row pad-mobile">
            <hr/>
            Already have an account? <Link href="/login" className="text-center new-account">Log in.</Link>
        </div>
      </div>
    );
  }
}
