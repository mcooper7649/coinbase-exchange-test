import { v4 as uuidv4 } from 'uuid';
import React, { useEffect } from 'react';
import { USDollar } from '../utils/utils';
import Loader from './Loader';

const OBP = ({ orders, type, viewSize = 14 }) => {
  useEffect(() => {}, [orders]);

  return (
    <div className={type === 'ask' ? 'OBP OBP--ask' : 'OBP OBP--sell'}>
      {orders?.slice(0, viewSize).map((order, index) => {
        if (order[1]) {
          return (
            <div className="OBP__order" key={uuidv4()}>
              <div className="OBP__size">
                <div
                  className="OBP__bar"
                  style={{ width: Math.min((order[1] / 3.5) * 25, 25) }}
                ></div>
                {order[1]}
              </div>
              <div key={index} className="OBP__price">
                {USDollar.format(order[0])}
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
