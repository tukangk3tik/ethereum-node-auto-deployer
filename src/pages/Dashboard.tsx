import React from 'react';
import { 
  UserIcon, 
  AcademicCapIcon, 
  OfficeBuildingIcon, 
  ChartBarIcon 
} from '@heroicons/react/outline';
import { ServerIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { FiAlertOctagon, FiBarChart, FiWifi } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your ETH Node management system
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <ServerIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Nodes Registered</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">1,234</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark">
                View all
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Nodes</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">12</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark">
                View all
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
                <FiAlertOctagon className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Recent Failures</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">2</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark">
                View all
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                <FiBarChart className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Network Distribution</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">89</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark">
                View all
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`https://ui-avatars.com/api/?name=User+${item}&background=random`}
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    User {item} <span className="text-gray-500 font-normal">performed an action</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(Date.now() - item * 3600000).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn-primary flex items-center justify-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Add Student
            </button>
            <button className="btn-primary flex items-center justify-center">
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Add Teacher
            </button>
            <button className="btn-primary flex items-center justify-center">
              <OfficeBuildingIcon className="h-5 w-5 mr-2" />
              Add School
            </button>
            <button className="btn-primary flex items-center justify-center">
              <ChartBarIcon className="h-5 w-5 mr-2" />
              View Reports
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;