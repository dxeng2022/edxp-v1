import { useEffect, useRef, useState } from 'react';
import { Backdrop, Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RefreshIcon from '@mui/icons-material/Refresh';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPath } from '../actions';



export default function VisualDrawPreview() {

  const dispatch = useDispatch();

  const visualDrawImg = useSelector(state => state.visualDrawImg);
  const visualDrawJson = useSelector(state => state.visualDrawJson);

  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  const transformWrapperRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  // 드래그 시작 시 호출될 함수
  const handleDragStart = () => {
    setIsDragging(true);
  };

  // 드래그 종료 시 호출될 함수
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleBeforeUnload = useRef((e) => {
    e.preventDefault();
    e.returnValue = '';
  });

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload.current);
    return () => {
      // eslint-disable-next-line
      window.removeEventListener('beforeunload', handleBeforeUnload.current);
    };
  }, []);

  const handleButtonClick = () => {
    window.removeEventListener('beforeunload', handleBeforeUnload.current);
    dispatch(setCurrentPath('draw/'));
    window.location.reload();
  };


  return (

    <Box
      sx={{ 
        height:'100%', 
        width:'100%', 
        backgroundColor:'#EEEEEE',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>

      <Box sx={{ zIndex:1, px:1, display:'flex', alignItems:'center', justifyContent: 'space-between',  position: 'sticky', top: 0, backgroundColor:'#FFFFFF' }}>
        <Typography
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          도면 이미지 미리보기
        </Typography>
        <Button sx={{ whiteSpace: 'nowrap' }} size="small" onClick={handleButtonClick}>데이터 다시 선택하기</Button>
      </Box>
      
      <Box sx={{ position: 'relative', cursor: isDragging ? 'grabbing' : 'grab' }} onMouseDown={handleDragStart} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}>

        <TransformWrapper
          defaultScale={1}
          defaultPositionX={200}
          defaultPositionY={100}
          ref={transformWrapperRef}
        >
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              <TransformComponent>
                <img src={visualDrawImg} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100vh' }} />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        <Backdrop
          sx={{ 
            color: '#fff', 
            zIndex: (theme) => theme.zIndex.drawer + 1,
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

      <Box sx={{ zIndex:1, px:1, display:'flex', alignItems:'center', justifyContent: 'space-between',  position: 'sticky', bottom: 0, backgroundColor:'#FFFFFF' }}>
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