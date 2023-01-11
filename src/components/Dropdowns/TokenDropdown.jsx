import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Fragment, useRef } from 'react';
import { FaBitcoin, FaEthereum } from 'react-icons/fa';
import { SiLitecoin, SiBitcoincash } from 'react-icons/si';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import './Dropdown.styles.css';

const projects = [
  {
    name: 'Bitcoin',
    description:
      'The Original Crypto Project. Founded in 2009 by Satoshi Nakamoto.',
    value: 'BTC-USD',
    icon: IconOne,
  },
  {
    name: 'Ethereum',
    description: 'Industry Leader in Smart Contracts and ERC-20 Standard',
    value: 'ETH-USD',
    icon: IconThree,
  },
  {
    name: 'Litecoin',
    description: 'A Testbed for Bitcoin Development. A Charlie Lee Project.',
    value: 'LTC-USD',
    icon: IconTwo,
  },
  {
    name: 'Bitcoin Cash',
    description:
      'Proof of Work, Cheaper and Faster alternative to Bitcoin for Everyday Transactions.',
    value: 'BCH-USD',
    icon: IconFour,
  },
];

function checkPair(pair) {
  if (pair === 'Select') {
    return true;
  } else return false;
}

export default function TokenDropdown({ handleSelect }) {
  const activePair = useSelector((state) => state.pairer.activePair);
  const buttonRef = useRef(null);
  const timeoutDuration = 200;
  let timeout;

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
    <div className="w-full max-w-sm px-4 top-16 ">
      <Popover className="relative ">
        {({ open }) => {
          return (
            <>
              <div onMouseLeave={onMouseLeave.bind(null, open)}>
                <Popover.Button
                  ref={buttonRef}
                  className={`
                  ${open ? '' : 'text-opacity-90'}
                   group px-2 rounded-md inline-flex items-center text-base font-medium ring-2 ring-orange-400  hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${
                     checkPair(activePair) ? 'animate-bounce' : ''
                   }
                  ${!isDarkMode ? 'bg-gray-800' : 'bg-gray-300'}
                  `}
                  onMouseEnter={onMouseEnter.bind(null, open)}
                  onMouseLeave={onMouseLeave.bind(null, open)}
                >
                  <span
                    className={`text-xs  ${
                      !isDarkMode ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                  >
                    {activePair}
                  </span>
                  <ChevronDownIcon
                    className={`${open ? '' : 'text-opacity-70'}
                    ml-2 h-5 w-5  group-hover:text-opacity-80 transition ease-in-out duration-150
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
                  <Popover.Panel className="absolute z-10 ml-[25vw] lg:ml-[5vw] w-screen max-w-sm px-4 mt-0 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                    <div
                      className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                      onMouseEnter={onMouseEnter.bind(null, open)}
                      onMouseLeave={onMouseLeave.bind(null, open)}
                    >
                      <div className="p-4 bg-gray-50">
                        {' '}
                        <span className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            Set Active Token (All Pairs in USD)
                          </span>
                        </span>
                      </div>
                      <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                        {projects.map((item) => (
                          <div
                            key={item.name}
                            onClick={() => handleSelect(item.value)}
                            className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                          >
                            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                              <item.icon aria-hidden="true" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
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

function IconOne() {
  return (
    // <svg
    //   width="48"
    //   height="48"
    //   viewBox="0 0 48 48"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    <div>
      <FaBitcoin
        className="text-6xl"
        width="48"
        height="48"
        rx="8"
        fill="#f2a900"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
    // </svg>
  );
}

function IconTwo() {
  return (
    <div>
      <SiLitecoin
        className="text-6xl"
        width="48"
        height="48"
        rx="8"
        fill="#00aeff"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
}

function IconThree() {
  return (
    <div>
      <FaEthereum
        className="text-6xl"
        width="48"
        height="48"
        rx="8"
        fill="#3c3c3d"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
}

function IconFour() {
  return (
    <div>
      <SiBitcoincash
        className="text-6xl"
        width="48"
        height="48"
        rx="8"
        fill="#ee8c28"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
}
