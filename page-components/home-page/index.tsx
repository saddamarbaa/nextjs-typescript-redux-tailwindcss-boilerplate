import { useEffect } from 'react';
import { connect } from 'react-redux';
import { ReducerType } from 'global-states';
import { updateLists } from 'global-states/actions';
import { _countryReducerState as ReducerState, CountryType } from 'types';

// props from connect mapDispatchToProps
interface MapDispatchProps {
  updateLists: (payload: CountryType[]) => void;
}

// props from connect mapStateToProps
interface MapStateProps {
  listState: ReducerState;
}

// props passed in to the component
interface OwnProps {
  countryList: CountryType[];
}

type PropsType = MapDispatchProps & MapStateProps & OwnProps;

function Index(props: PropsType) {
  // eslint-disable-next-line react/destructuring-assignment
  console.log(props.listState);
  useEffect(() => {
    const { countryList } = props;
    // eslint-disable-next-line react/destructuring-assignment
    props.updateLists(countryList);
  }, []);

  return <div />;
}

const mapStateToProps = (state: ReducerType) => ({
  listState: state.list,
});

const mapDispatchToProps = {
  updateLists,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
