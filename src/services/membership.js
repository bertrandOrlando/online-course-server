import * as MembershipRepository from "../repository/membership.js";

export const addMembership = async (userId, duration) => {
  const membership = await MembershipRepository.addMembership(userId, duration);

  return membership;
};
