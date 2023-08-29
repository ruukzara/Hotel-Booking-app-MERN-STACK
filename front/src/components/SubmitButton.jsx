import React from 'react';

export const SubmitButton = ({loading = false, label = 'Save', icon = 'fa-save'}) => {
    return (
        <button type="submit" disabled={loading}>
            <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : icon}`}></i>
            &nbsp; {label}
        </button>
    )
}
