import React, { FC } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

interface IKSHProps {
  show: boolean;
  dismiss: () => void;
}

export const KeyboardShortcutHelp: FC<IKSHProps> = ({ show, dismiss }) => {
  let modal;
  if (show) {
    modal = (
      <div key={1}>
        <div className="modal-backdrop"></div>
        <div className="modal scale-in keyboard-shortcuts">
          <div className="modal-header">
            <h2>Keyboard Shortcuts</h2>
            <button className="dismiss-btn" onClick={dismiss}>&times;</button>
          </div>
          <div className="modal-body flex">
            <div className="flex-col">
              <table>
                <thead>
                  <tr>
                    <td colSpan={2}><strong>Global</strong></td>
                  </tr>
                  <tr>
                    <th className="one-third">Key</th>
                    <th className="two-thirds">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="one-third"><span className="key light">G</span> then<span className="key light">H</span></td>
                    <td className="two-thirds">Go to Home page</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">G</span> then<span className="key light">S</span></td>
                    <td className="two-thirds">Go to Stats Page</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">G</span> then<span className="key light">Y</span></td>
                    <td className="two-thirds">Go to Yearly Results Page</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">G</span> then<span className="key light">D</span></td>
                    <td className="two-thirds">Go to Depth Chart</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">G</span> then<span className="key light">R</span></td>
                    <td className="two-thirds">Go to Recruiting Page</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">G</span> then<span className="key light">P</span></td>
                    <td className="two-thirds">Go to Profile Page</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">C</span></td>
                    <td className="two-thirds">Check in to today's game (only works if logged in)</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">K</span></td>
                    <td className="two-thirds">Show/hide keyboard shortcuts</td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-condensed table-responsive">
                <thead>
                  <tr>
                    <td colSpan={2}><strong>Stats Page</strong></td>
                  </tr>
                  <tr>
                    <th className="one-third">Key</th>
                    <th className="two-thirds">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="one-third"><span className="key light">/</span></td>
                    <td className="two-thirds">Place cursor in team select box</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">Shift</span> + <span className="key light">Enter</span></td>
                    <td className="two-thirds">Submit (works even if cursor is in team select field)</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">R</span></td>
                    <td className="two-thirds">Reset form</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">Tab</span> then <span className="key light">Space</span></td>
                    <td className="two-thirds">Tab through the games, and press [Space] to update attendance for the highlighted game</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex-col">
              <table className="table table-condensed table-responsive">
                <thead>
                  <tr>
                    <td colSpan={2}><strong>Yearly Results Page</strong></td>
                  </tr>
                  <tr>
                    <th className="one-third">Key</th>
                    <th className="two-thirds">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="one-third"><span className="key light">&#x2B05;</span></td>
                    <td className="two-thirds">View previous year</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light"><span className="flip">&#x2B05;</span></span></td>
                    <td className="two-thirds">View next year</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">Tab</span> then <span className="key light">Space</span></td>
                    <td className="two-thirds">Tab through the games, and press [Space] to update attendance for the highlighted game</td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-condensed table-responsive">
                <thead>
                  <tr>
                    <td colSpan={2}><strong>Recruiting Page</strong></td>
                  </tr>
                  <tr>
                    <th className="one-third">Key</th>
                    <th className="two-thirds">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="one-third"><span className="key light">&#x2B05;</span></td>
                    <td className="two-thirds">View previous recruiting class</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light"><span className="flip">&#x2B05;</span></span></td>
                    <td className="two-thirds">View next recruiting class</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">N</span></td>
                    <td className="two-thirds">Sort by Name</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">P</span></td>
                    <td className="two-thirds">Sort by Position</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">H</span></td>
                    <td className="two-thirds">Sort by Hometown</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">Shift</span> + <span className="key light">H</span></td>
                    <td className="two-thirds">Sort by High School</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">R</span></td>
                    <td className="two-thirds">Sort by Rivals <span className="glyphicon glyphicon-star"></span></td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">S</span></td>
                    <td className="two-thirds">Sort by Scout <span className="glyphicon glyphicon-star"></span></td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">Shift</span> + <span className="key light">R</span></td>
                    <td className="two-thirds">Sort by Rivals Rank</td>
                  </tr>
                  <tr>
                    <td className="one-third"><span className="key light">Shift</span> + <span className="key light">S</span></td>
                    <td className="two-thirds">Sort by Scout Rank</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <CSSTransitionGroup
      transitionName="modal-pop-in"
      transitionAppear={false}
      transitionLeave={true}
      transitionEnter={true}
      transitionEnterTimeout={200}
      transitionLeaveTimeout={200}>
      { modal || [] }
    </CSSTransitionGroup>
  );
};