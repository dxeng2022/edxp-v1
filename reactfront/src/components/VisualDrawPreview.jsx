import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RefreshIcon from '@mui/icons-material/Refresh';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import { useEffect, useRef, useState } from 'react';
import { Backdrop, Box, IconButton, Tooltip, Typography } from '@mui/material';
import { KeepScale, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setVisualDrawTag } from '../actions';

export default function VisualDrawPreview() {

  const location = useLocation();
  const dispatch = useDispatch();

  const transformWrapperRef = useRef(null);
  const imgRef = useRef();

  const visualDrawImg = useSelector(state => state.visualDrawImg);
  const visualDrawJson = useSelector(state => state.visualDrawJson);
  const visualDrawTag = useSelector(state => state.visualDrawTag);
  const visualDrawTagX = useSelector(state => state.visualDrawTagX);
  const visualDrawTagY = useSelector(state => state.visualDrawTagY);

  const [isDragging, setIsDragging] = useState(false);
  const [open, setOpen] = useState(true);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [tagX, setTagX] = useState(0);
  const [tagY, setTagY] = useState(0);

  //backdrop 없애기
  const handleClose = () => {
    setOpen(false);
  };

  // 드래그 시작 시 호출될 함수
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // 드래그 종료 시 호출될 함수
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // img 브라우저 크기 업데이트
  useEffect(() => {
    const updateSize = () => {
      if (imgRef.current) {
        setImgWidth(imgRef.current.offsetWidth);
        setImgHeight(imgRef.current.offsetHeight);
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
    // eslint-disable-next-line
  }, [imgRef.current, visualDrawTag]);
  
  // Tag 위치 계산
  useEffect(() => {
    setTagX((visualDrawTagX / visualDrawJson.plantModel.paperSize.width) * imgWidth - 18);
    setTagY(((visualDrawJson.plantModel.paperSize.height - visualDrawTagY) / visualDrawJson.plantModel.paperSize.height) * imgHeight - 22);
    // eslint-disable-next-line
  }, [imgWidth, imgHeight, visualDrawTagX, visualDrawTagY]);

  // Tag 자동 zoomin
  useEffect(() => {
    if (transformWrapperRef.current) {
      transformWrapperRef.current.zoomToElement('icon', 3, 1000, 'easeInQuad');
    }
  }, [tagX, tagY]);

  // url 변경시 tag 없애기
  useEffect(() => {
    dispatch(setVisualDrawTag(false));
    // eslint-disable-next-line
  }, [location.pathname]);

  return (

    <Box
      sx={{ 
        height:'100%', 
        width:'100%', 
        backgroundColor:'#EEEEEE',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>

      <Box sx={{ zIndex:1, px:1, display:'flex', alignItems:'center', justifyContent: 'space-between',  position: 'relative', top: 0, backgroundColor:'#FFFFFF' }}>
        <Typography
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          도면 이미지 미리보기
        </Typography>
      </Box>
      
      <Box sx={{ position: 'relative', cursor: isDragging ? 'grabbing' : 'grab', overflow: 'auto' }} onMouseDown={handleDragStart} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}>
        <TransformWrapper
          defaultScale={1}
          defaultPositionX={200}
          defaultPositionY={100}
          ref={transformWrapperRef}
        >
          {({ zoomIn, zoomOut, resetTransform, setTransform, ...rest }) => (
            <>
              <TransformComponent>
                <img ref={imgRef} src={visualDrawImg} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                {visualDrawTagX !== null && visualDrawTag && (
                  <div style={{ position: "absolute", left: `${tagX}px`, top: `${tagY}px` }}>
                    <KeepScale>
                      <FmdGoodIcon id='icon' fontSize="large" sx={{ color: 'rgba(244, 67, 54, 0.9)' }}/>
                    </KeepScale>
                  </div>
                )}
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        <Backdrop
          sx={{ 
            color: '#fff', 
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          open={open}
          onClick={handleClose}
        >
          <Typography>마우스 휠 - 축소/확대</Typography>
          <Typography>마우스 클릭 - 이동</Typography>
        </Backdrop>
      </Box>

      <Box sx={{ px:1, display:'flex', alignItems:'center', justifyContent: 'space-between',  position: 'relative', bottom: 0, backgroundColor:'#FFFFFF' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Typography
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            variant="caption"
          >
            현재 해상도: {visualDrawJson.plantModel.paperSize.width}x{visualDrawJson.plantModel.paperSize.height}
          </Typography>
          <Typography
            sx={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: '#999999'
            }}
            variant="caption"
          >
            해상도에 따라 지연 현상이 발생할 수 있습니다. 
          </Typography>
        </Box>

        <Box sx={{ whiteSpace: 'nowrap' }}>
          <Tooltip title='배율 되돌리기'>
            <IconButton
              onClick={() => {
                transformWrapperRef.current.resetTransform();
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='확대'>
            <IconButton
              onClick={() => transformWrapperRef.current.zoomIn()}
              color="primary"
              aria-label="zoom in"
            >
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='축소'>
            <IconButton
              onClick={() => transformWrapperRef.current.zoomOut()}
              color="primary"
              aria-label="zoom out"
            >
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

    </Box>
  );
}