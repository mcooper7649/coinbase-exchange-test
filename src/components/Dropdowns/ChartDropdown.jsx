import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Fragment, useRef } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useContext } from 'react';

import './Dropdown.styles.css';

export default function ChartDropdown({
  granularity,
  handleChart,
  activeGranularity,
}) {
  const buttonRef = useRef(null);
  const timeoutDuration = 200;
  let timeout;

  function checkGran(gran) {
    if (gran === 'Granularity') {
      return true;
    } else return false;
  }

  const closePopover = () => {
    return buttonRef.current?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      })
    );
  };

  const onMouseEnter = (open) => {
    clearTimeout(timeout);
    if (open) return;
    return buttonRef.current?.click();
  };

  const onMouseLeave = (open) => {
    if (!open) return;
    timeout = setTimeout(() => closePopover(), timeoutDuration);
  };

  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="w-full max-w-sm font-sans px-4 top-16">
      <Popover className="relative">
        {({ open }) => {
          return (
            <>
              <div onMouseLeave={onMouseLeave.bind(null, open)}>
                <Popover.Button
                  ref={buttonRef}
                  className={`
                  ${open ? '' : 'text-opacity-90'}
                  group px-2 rounded-md inline-flex items-center text-base ring-2 ring-orange-400 font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
                    checkGran(activeGranularity) ? 'animate-bounce' : ''
                  }
                  ${!isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}
                  `}
                  onMouseEnter={onMouseEnter.bind(null, open)}
                  onMouseLeave={onMouseLeave.bind(null, open)}
                >
                  <span
                    className={`text-xs ${
                      !isDarkMode ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  >{`${activeGranularity}`}</span>
                  <ChevronDownIcon
                    className={`${open ? '' : 'text-opacity-70'}
                    ml-2 h-5 w-5 group-hover:text-opacity-80 transition ease-in-out duration-150
                    ${!isDarkMode ? 'text-orange-300' : 'text-gray-800'}
                    `}
                    aria-hidden="true"
                  />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute ml-[25vw] lg:ml-[5vw] z-1 w-screen max-w-sm px-4 mt-0 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                    <div
                      className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                      onMouseEnter={onMouseEnter.bind(null, open)}
                      onMouseLeave={onMouseLeave.bind(null, open)}
                    >
                      <div className="p-4 bg-gray-50">
                        {' '}
                        <span className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            Set Chart Granularity Options
                          </span>
                        </span>
                      </div>
                      <div className="text-gray-800 relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                        {granularity.map((gran, idx) => {
                          return (
                            <button
                              className="cursor-pointer bg-gray-200 hover:bg-gray-100 p-1 m-1"
                              key={idx}
                              value={gran[0]}
                              onClick={(e) => {
                                handleChart(e);
                              }}
                            >
                              Last {gran[1]}
                            </button>
                          );
                        })}
                      </div>
                      <div className="p-4 bg-gray-50">
                        <a
                          href="https://www.coinbase.com/cloud"
                          target="_blank"
                          rel="noreferrer"
                          className="flow-root px-2 py-2 transition duration-150 ease-in-out rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        >
                          <span className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">
                              Coinbase API Documentation
                            </span>
                          </span>
                          <span className="block text-sm text-gray-500">
                            Data Feed Currently Provided By Coinbase
                          </span>
                        </a>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </div>
            </>
          );
        }}
      </Popover>
    </div>
  );
}
