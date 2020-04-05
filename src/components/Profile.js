import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Profile = ({ profile }) => {
  if (!profile) return "Loading...";
  return (
    <>
      <h1>Profile</h1>
      <p>{profile.nickname}</p>
      <img
        style={{ maxWidth: 50, maxHeight: 50 }}
        src={profile.picture}
        alt="profile pics"
      />
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    profile: state.userContext.profile
  };
}

export default connect(mapStateToProps)(Profile);
