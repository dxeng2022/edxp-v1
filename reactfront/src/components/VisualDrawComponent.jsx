import { Box, Divider, FormControl, Grid, ImageList, ImageListItem, MenuItem, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setVisualDrawTagX, setVisualDrawTagY } from '../actions';
import VisualDrawComponentInfo from './VisualDrawComponentInfo';


export default function VisualDrawComponent() {

  const dispatch = useDispatch();

  const visualDrawJson = useSelector(state => state.visualDrawJson);
  const visualDrawLineData = useSelector(state => state.visualDrawLineData);
  const visualDrawSymbolData = useSelector(state => state.visualDrawSymbolData);

  const [selected, setSelected] = useState(1);
  const [imageError, setImageError] = useState({});
  const [componentName, setComponentName] = useState('');
  const [componentInfo, setComponentInfo] = useState(false);
  const [componentInfoSize, setComponentInfoSize] = useState(12);
  const [componentCols, setComponentCols] = useState(3);
  const [componentPath, setComponentPath] = useState('/symbols/');
  const [extent, setExtent] = useState({});
  const [position, setPosition] = useState({});
  const [page, setPage] = useState(0);
  const [xy, setXy] = useState(extent);
  let rowsPerPage = 10;
  let matchedData, ratio = 0;

  // symbols,lines select 선택 시
  const handleChange = (event) => {
    let selectedValue = Number(event.target.value);
    setSelected(selectedValue);
    setComponentInfo(false);
    setComponentCols(3);
    setComponentInfoSize(12);
    setExtent({});
    setPosition({});
    dispatch(setVisualDrawTagX(null));
  
    if (selectedValue === 1) {
      setComponentPath('/symbols/');
    } else if (selectedValue === 2) {
      setComponentPath('/lines/');
    }
  };

  // 미리보기 이미지 없을 때
  const handleImageError = (id) => {
    setImageError(prevState => ({ ...prevState, [id]: true }));
  };
  
  // 이미지 선택 시
  const handleImageClick = (id) => {
    setComponentInfo(true);
    setComponentCols(2);
    setComponentName(id);
    setComponentInfoSize(6);
    dispatch(setVisualDrawTagX(null));
  };

  // VisualDrawComponentInfo 닫을 때
  const handleInfoClose = () => {
    setComponentInfo(false);
    setComponentCols(3);
    setComponentInfoSize(12);
    setComponentName('');
    setExtent({});
    setPosition({});
    dispatch(setVisualDrawTagX(null));
  }

  // symbols, lines 비율 계산
  if (selected === 1) {
    matchedData = visualDrawSymbolData.find(data => data.id === componentName);
    if (matchedData && visualDrawJson.countSymbol) {
      ratio = ((matchedData.value / visualDrawJson.countSymbol) * 100);
    }
  } else if (selected === 2) {
    matchedData = visualDrawLineData.find(data => data.id === componentName);
    if (matchedData && visualDrawJson.countLine) {
      ratio = ((matchedData.value / visualDrawJson.countLine) * 100);
    }
  }
  
  // symbols, lines 전체 갯수
  const getCount = () => {
    if (selected === 1) {
      return visualDrawJson.countSymbol;
    } else if (selected === 2) {
      return visualDrawJson.countLine;
    }
  };

  // symbols, lines 좌표 redux 저장
  const handleCellClick = (location) => {
    if ('start' in location) {
      dispatch(setVisualDrawTagX(location.start.x));
      dispatch(setVisualDrawTagY(location.start.y));
    } else {
      dispatch(setVisualDrawTagX(location.x));
      dispatch(setVisualDrawTagY(location.y));
    }
  };

  // symbols, lines 모든 좌표 useState 저장
  useEffect(() => {
    let matchedChildren;
  
    if (componentName === 'tee') {
      matchedChildren = visualDrawJson.plantModel.children.filter(child => child.componentClass === componentName);
    } else {
      matchedChildren = visualDrawJson.plantModel.children.filter(child => child.name === componentName);
    }
  
    if (selected === 1) {
      let newExtent = {};
      matchedChildren.forEach(child => {
        if (child.extent && child.extent.coordinateSystem) {
          newExtent[child.id] = child.extent.coordinateSystem.location;
        }
      });
      setExtent(newExtent);
    } else if (selected === 2) {
      let newPosition = {};
      matchedChildren.forEach(child => {
        if (child.end && child.end.position) {
          newPosition[child.id] = {
            start: child.start.position,
            end: child.end.position
          };
        }
      });
      setPosition(newPosition);
    }
  }, [componentName, visualDrawJson, selected]);

  // symbols, lines 좌표 찾기 위해 json 명칭 변경
  useEffect(() => {
    if (selected === 1) {
      setXy(extent);
    } else if (selected === 2) {
      setXy(position);
    }
  }, [selected, extent, position]);
  
  // pagination 초기화
  useEffect(() => {
    setPage(0);
  }, [componentName])

  return (
    <>
      <Box sx={{ pt:1, pb:0.5, pl:2, display:'flex', alignItems: 'center'}}>
        <FormControl size="small" sx={{ width:'120px'}}>
          <Select
            value={selected}
            onChange={handleChange}
          >
            <MenuItem value={1}>Symbols</MenuItem>
            <MenuItem value={2}>Lines</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="subtitle2" sx={{ pl:1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>Component를 선택해주세요.</Typography>
      </Box>
      
      <Divider variant="middle"/>

      <Grid container spacing={2} sx={{pr:0.5}}>
        <Grid item xs={componentInfoSize} sm={componentInfoSize} md={componentInfoSize} sx={{ display: 'flex', height: 'calc(100vh - 294px)', overflow:'auto', pr:1 }}>
          {selected === 1 ? 
            <ImageList variant="masonry" cols={componentCols} gap={6} sx={{mb:0, ml:2}} >
              {visualDrawSymbolData.map((data) => 
                <ImageListItem key={data.id} cols={1} rows={1}>
                  <Box sx={{ py:0.5, display:'flex', justifyContent: 'center', backgroundColor: componentName === data.id ? '#848484' : null, '&:hover': {backgroundColor: componentName === data.id ? '#848484' : '#EEEEEE'}}}>
                    {imageError[data.id] ? (
                      <Box sx={{ display:'flex', alignItems: 'center', border: '1px solid grey', '&:hover': {cursor: 'pointer'} }} onClick={() => handleImageClick(data.id)}>
                        <img
                          src={process.env.PUBLIC_URL + '/errorImage.png'}
                          alt={data.label}
                          style={{ maxWidth: '30px', height: '30px' }}
                        />
                        <Typography variant="body2">{data.id}</Typography>
                      </Box>
                    ) : (
                      <img
                        src={process.env.PUBLIC_URL + '/symbols/' + data.id + '.png'}
                        alt={data.label}
                        loading="lazy"
                        style={{ maxWidth: '80%', height: 'auto', border: '1px solid grey', cursor: 'pointer' }}
                        onError={() => handleImageError(data.id)}
                        onClick={() => handleImageClick(data.id)}
                      />
                    )}
                  </Box>
                </ImageListItem>
              )}
            </ImageList>
          :
            <ImageList variant="masonry" cols={componentCols} gap={6} sx={{mb:0, ml:2}}>
              {visualDrawLineData.map((data) => 
                <ImageListItem key={data.id} cols={1} rows={1}>
                  <Box sx={{ py:0.5, display:'flex', justifyContent: 'center', backgroundColor: componentName === data.id ? '#848484' : null, '&:hover': {backgroundColor: componentName === data.id ? '#848484' : '#EEEEEE'}}}>
                    {imageError[data.id] ? (
                      <Box sx={{ display:'flex', alignItems: 'center', border: '1px solid grey', '&:hover': {cursor: 'pointer'} }} onClick={() => handleImageClick(data.id)}>
                        <img
                          src={process.env.PUBLIC_URL + '/errorImage.png'}
                          alt={data.label}
                          style={{ maxWidth: '30px', height: '30px' }}
                        />
                        <Typography variant="body2">{data.id}</Typography>
                      </Box>
                    ) : (
                      <img
                        src={process.env.PUBLIC_URL + '/lines/' + data.id + '.png'}
                        alt={data.label}
                        loading="lazy"
                        style={{ maxWidth: '80%', height: 'auto', border: '1px solid grey', cursor: 'pointer' }}
                        onError={() => handleImageError(data.id)}
                        onClick={() => handleImageClick(data.id)}
                      />
                    )}
                  </Box>
                </ImageListItem>
              )}
            </ImageList>
          }
        </Grid>

        {componentInfo && 
          <VisualDrawComponentInfo
            handleInfoClose={handleInfoClose}
            componentPath={componentPath}
            componentName={componentName}
            getCount={getCount}
            matchedData={matchedData}
            ratio={ratio}
            xy={xy}
            page={page}
            rowsPerPage={rowsPerPage}
            handleCellClick={handleCellClick}
            setPage={setPage}
          />
        }

      </Grid>
    </>
  )
}
