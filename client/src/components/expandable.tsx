import { Component } from 'react';

export default class Expandable extends Component {
  constructor(props) {
    super(props);
    this.state = { initialized: false, collapsed: true };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && !this.state.initialized) {
      this.setState({ collapsed: !!nextProps.defaultCollapsed, initialized: true });
    }
  }

  toggle() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  render() {
    let collapsed = this.state.initialized ? this.state.collapsed : this.props.defaultCollapsed;
    let classes = collapsed ? 'expandable collapsed' : 'expandable';

    if (this.props.small) {
      classes += ' small';
    }

    if (this.props.centered) {
      classes += ' centered';
    }

    return (
      <div className={classes}>
        <div className="expandable-header">
          <h3><label for={`expandable-${this.props.title}`} >{ this.props.title }</label></h3>
        </div>
        <input className="hidden-checkbox" checked={ !collapsed } type="checkbox" id={`expandable-${this.props.title}`} onChange={() => this.toggle()} />
        <div className="expandable-body">
          { this.props.children }
        </div>
        <label className="toggle-btn-label" for={`expandable-${this.props.title}`} ></label>
      </div>
    );
  }
}