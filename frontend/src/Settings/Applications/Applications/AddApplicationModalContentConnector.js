import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { fetchApplicationSchema, selectApplicationSchema } from 'Store/Actions/settingsActions';
import AddApplicationModalContent from './AddApplicationModalContent';

function createMapStateToProps() {
  return createSelector(
    (state) => state.settings.applications,
    (applications) => {
      const {
        isSchemaFetching,
        isSchemaPopulated,
        schemaError,
        schema
      } = applications;

      const applicationGroups = [...schema]
        .sort((a, b) => a.applicationOrder - b.applicationOrder)
        .reduce(
          (acc, item) => {
            if (!acc[item.applicationType]) {
              acc[item.applicationType] = [];
            }

            acc[item.applicationType].push(item);

            return acc;
          },
          {}
        );

      return {
        isSchemaFetching,
        isSchemaPopulated,
        schemaError,
        applicationGroups
      };
    }
  );
}

const mapDispatchToProps = {
  fetchApplicationSchema,
  selectApplicationSchema
};

class AddApplicationModalContentConnector extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.fetchApplicationSchema();
  }

  //
  // Listeners

  onApplicationSelect = ({ implementation, name }) => {
    this.props.selectApplicationSchema({ implementation, presetName: name });
    this.props.onModalClose({ applicationSelected: true });
  };

  //
  // Render

  render() {
    return (
      <AddApplicationModalContent
        {...this.props}
        onApplicationSelect={this.onApplicationSelect}
      />
    );
  }
}

AddApplicationModalContentConnector.propTypes = {
  fetchApplicationSchema: PropTypes.func.isRequired,
  selectApplicationSchema: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired
};

export default connect(createMapStateToProps, mapDispatchToProps)(AddApplicationModalContentConnector);
