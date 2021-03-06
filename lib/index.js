'use strict';
var _ = require('lodash');

module.exports = function (config) {
  config = _.defaults(_.clone(config || {}), {
    authorizedComponents: 'authorizedComponents',
    authorizedToObject: 'authorizedToObject',
    authorizedSet: 'authorizedSet',
    authorizedArrayPush: 'authorizedArrayPush',
    authorizedArrayRemove: 'authorizedArrayRemove',
    authorizedArraySet: 'authorizedArraySet',
    permissions: 'permissions',
    permissionsGet: 'getPermissions',
    permissionsHas: 'hasPermissions',
    permissionsAssert: 'assertPermission',
    permissionsGetComponents: 'getComponents',
    teamMembers: 'members',
    teamGetUserIds: 'getUserIds',
    teamUserModel: 'User',
    teamModel: 'Team'
  });
  return {
    cloneWhitelisted: require('./cloneWhitelisted'),
    permissionsPlugin: require('./permissionsPlugin')(config),
    componentsPlugin: require('./componentsPlugin')(config),
    teamPlugin: require('./teamPlugin')(config)
  };
};
