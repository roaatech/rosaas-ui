import React, { useState, useEffect } from "react";
import { BsSortUpAlt, BsSortDown, BsArrowsExpand } from "react-icons/bs";
import { Wrapper } from "./ColumnSortHeader.styled";

const ColumnSortHeader = ({
  text,
  rebase,
  setRebase,
  setSortField,
  setSortValue,
  field,
}) => {
  const columnIcon = [<BsArrowsExpand />, <BsSortDown />, <BsSortUpAlt />];
  const [CurrentSort, setCurrentSort] = useState(0);
  const [hasAction, setHasAction] = useState(false);

  useEffect(() => {
    if (hasAction === false) {
      setCurrentSort(0);
    } else {
      setHasAction(false);
    }
  }, [rebase]);

  const currentColumn = (x) => {
    return columnIcon[x];
  };

  const toggleSearch = () => {
    setHasAction(true);
    setSortField(field);

    if (CurrentSort !== 2) {
      setCurrentSort(2);
      setSortValue(2);
    } else {
      setCurrentSort(1);
      setSortValue(1);
    }
    setRebase(rebase + 1);
  };

  return (
    <Wrapper onClick={toggleSearch}>
      {text} {currentColumn(CurrentSort)}
    </Wrapper>
  );
};

export default ColumnSortHeader;
