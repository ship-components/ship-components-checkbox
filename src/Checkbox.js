/** ****************************************************************************
 * CheckBox
 *
 * @author       Isaac Suttell <isaac@isaacsuttell.com>
 * @file         Reusable checkbox component
 ******************************************************************************/

// Modules
import React from 'react/addons';
import HighlightClick from 'react-highlight-click';

// Lets animate it
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class CheckBox extends React.Component {

  /**
   * Material Design inspired Cseckbox Component. Can either be controlled or uncontrolled.
   * @param  {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      selected: props.readOnly === true ? props.selected : props.defaultValue
    };
  }

  /**
   * If we're in readOnly mode then keep the state in sync with the props
   * @param  {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.readOnly === true && this.state.selected !== nextProps.selected) {
      this.setState({
        selected: nextProps.selected
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.selected !== nextProps.selected || this.state.selected !== nextState.selected;
  }

  /**
   * Toggle it
   */
  handleClick() {
    // Toggle
    this.setState({
      selected: !this.state.selected
    }, () => {
      // Ensure the state is update to date
      this.triggerChangeEvent();
    });
  }

  /**
   * Create and send a change event to the parent
   */
  triggerChangeEvent() {
    // Generate a change event to let the parent know
    let customEvent = new window.MouseEvent('change');

    // Grab the dom element so the event.target is correct
    let el = React.findDOMNode(this.refs.input);

    // Calls parent change function with the custom event and the right target
    let handler = function(ev) {
      // Clean up
      el.removeEventListener('change', handler);
      if (typeof this.props.onChange === 'function'){
        // Call
        this.props.onChange.call(ev, ev);
      }
    }.bind(this);

    // Attach
    el.addEventListener('change', handler);

    // Trigger
    el.dispatchEvent(customEvent);
  }

  /**
   * Render Method
   * @return {React}
   */
  render() {
    let classes = 'check-box';

    let selected = this.props.readOnly === true ? this.props.selected : this.state.selected;

    if (selected) {
      classes += ' check-box--checked';
    }

    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    return (
      <HighlightClick
        className={classes}
        onClick={this.handleClick.bind(this)} >
        <div
          className='check-box--input' >
          {this.props.outlineIcon}
          <ReactCSSTransitionGroup
            transitionName='check-box--icon' >
            {selected === true ? this.props.selectedIcon: null}
          </ReactCSSTransitionGroup>
        </div>
        <label className='check-box--label'>
          {this.props.label || this.props.children}
        </label>
        <input
          className='check-box--controller'
          readOnly={this.props.readOnly}
          type={this.props.type}
          checked={this.state.selected}
          defaultValue={this.props.value}
          value={this.props.value || this.state.selected}
          ref='input'
        />
    </HighlightClick>
    );
  }
}

/**
 * Type Checks
 * @type {Object}
 * @static
 */
CheckBox.propTypes = {
  defaultValue: React.PropTypes.string,
  readOnly: React.PropTypes.bool,
  selected: React.PropTypes.bool,
  value: React.PropTypes.string,
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  outlineIcon: React.PropTypes.element.isRequired,
  selectedIcon: React.PropTypes.element.isRequired
}

/**
 * Defaults
 * @type {Object}
 * @static
 */
CheckBox.defaultProps = {
  type: 'checkbox',
  defaultValue: '',
  readOnly: false,
  outlineIcon: <span className='check-box--icon-background icon-check_box_outline_blank' />,
  selectedIcon: <span className='check-box--icon icon-check_box' />
}
