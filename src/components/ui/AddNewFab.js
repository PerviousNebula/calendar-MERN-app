import React from 'react'
import { useDispatch } from 'react-redux';

import { uiOpenModal } from '../../actions/ui';

export const AddNewFab = () => {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(uiOpenModal());
    };

    return (
        <button
            type="button"
            className="btn btn-primary fab"
            onClick={ handleClick }
        >
            <i className="fas fa-plus" />
        </button>
    )
}
