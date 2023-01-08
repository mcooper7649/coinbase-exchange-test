import { v4 as uuidv4 } from 'uuid';
import { useContext } from 'react';
import { USDollar } from '../../utils/utils';
import Loader from '../Loader';
import './Orderbook.styles.css';
import { Tooltip } from '../../utils/Tooltip/Tooltip';
import { ThemeContext } from '../../contexts/ThemeContext';

const OBP = ({ orders, type, viewSize = 14 }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  return (
    <div className={type === 'ask' ? 'OBP OBP--ask' : 'OBP OBP--sell'}>
      {orders?.slice(0, viewSize).map((order, index) => {
        if (order[1]) {
          let totalOrder = USDollar.format(order[0] * order[1]);

          function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }

          return (
            <div
              className={`OBP__order hover:text-yellow-300 hover:border-b-4 border-indigo-100 ${
                !isDarkMode ? '' : 'test'
              }`}
              index={index}
              key={uuidv4()}
            >
              <div className="OBP__size " key={uuidv4()}>
                <div
                  key={uuidv4()}
                  className="OBP__bar"
                  style={{ width: Math.min((order[1] / 3.5) * 25, 25) }}
                ></div>
                <Tooltip
                  text={`Total ${capitalizeFirstLetter(
                    type
                  )} Order  ${totalOrder}`}
                >
                  {order[1]}
                </Tooltip>
              </div>

              <div key={uuidv4()} className="OBP__price ">
                <Tooltip
                  text={`Total Order  ${capitalizeFirstLetter(totalOrder)}`}
                >
                  {USDollar.format(order[0])}
                </Tooltip>
              </div>
            </div>
          );
        } else {
          return <Loader />;
        }
      })}
    </div>
  );
};

export default OBP;
