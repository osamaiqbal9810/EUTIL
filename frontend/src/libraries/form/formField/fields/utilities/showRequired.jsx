import React  from 'react';

export const showRequired = (required) => {
  return required ? (
    <span className="required-fld">
      *
    </span>
  ) : null;
};