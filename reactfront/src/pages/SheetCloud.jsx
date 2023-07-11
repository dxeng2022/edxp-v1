import './SheetCloud.css';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SheetCloud() {

  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState("sheet/");


  //왼쪽 폴더 리스트 불러오기
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch(`/api/v1/file/get-folder?currentPath=${encodeURIComponent(currentPath)}`);
        const folder = await response.json();
        // console.log(folder);
        const folderTree = buildFolderTree(folder.result); // 폴더 트리 구축
        setFolders(folderTree); // 폴더 트리를 folders state에 설정
        // setFolders(folder.result);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFolders();
  }, []);
  //왼쪽 폴더 리스트 불러오기

  //
  // depth를 계산하는 함수를 추가합니다.
  const calculateDepth = (folderPath) => {
    return folderPath.split("/").length - 2;
  };
  //
  // buildFolderTree 함수: 폴더 리스트를 받아 폴더 트리 구조를 반환합니다.
  const buildFolderTree = (folders) => {
    const folderTree = []; // 결과가 될 폴더 트리 배열입니다.
    const folderLookup = {}; // 폴더의 파일 경로를 키로 사용하여 폴더를 찾아내는 객체입니다.

    const rootFolder = {
      folderName: "sheet",
      folderPath: "sheet/",
      children: [],
      depth: 0,
    };
    folderLookup["/"] = rootFolder;
    folderTree.push(rootFolder);

    // 각 폴더에 children 속성을 추가하고, 폴더 경로를 기반으로 folderLookup 객체를 생성합니다.
    folders.forEach((folder) => {
      folder.depth = calculateDepth(folder.folderPath); // 폴더의 깊이를 계산하고 폴더 객체에 추가합니다.
      folder.children = []; // 하위 폴더를 저장할 children 배열을 초기화합니다.
      folderLookup[folder.folderPath] = folder; // 경로를 키로 사용하여 folderLookup 객체에 폴더를 추가합니다.
    });

    // 각 폴더의 부모 폴더를 찾아 children 배열에 추가하거나 최상위 폴더로 설정합니다.
    folders.forEach((folder) => {
      const parentFolder = folderLookup[folder.folderPath.split("/").slice(0, -2).join("/") + "/"]; // 폴더의 부모 경로를 찾습니다.
      if (parentFolder) {
        parentFolder.children.push(folder); // 부모 폴더의 children 배열에 현재 폴더를 추가합니다.
      } else {
        folderTree.push(folder); // 부모 폴더가 없으면 최상위 폴더로 설정합니다.
      }
    });

    return folderTree; // 최종적으로 생성된 폴더 트리를 반환합니다.
  };
  //

  // renderFolderTree 함수: 폴더 트리를 받아 폴더 목록을 출력합니다.
  const renderFolderTree = (folders, depth = 0) => {
    // 매개변수 "folders"를 순회하여 각 폴더를 JSX로 변환합니다.
    return folders.map((folder, index) => {
      const folderName = folder.folderName; // 폴더의 이름입니다.
      const folderPath = folder.folderPath; // 폴더의 파일 경로입니다.
      const folderDepth = folder.depth; // 폴더의 깊이입니다.
      const hasChildren = folder.children && folder.children.length > 0; // 하위 폴더가 있는지 확인합니다.

      // 각 폴더에 대한 JSX 요소입니다. (폴더 클릭 이벤트를 포함)
      const folderNode = (
        <div
          key={index}
          className={`folder-node depth-${folderDepth}`} // 각 깊이에 해당하는 클래스 이름을 추가합니다.
          onClick={() => handleFolderClick(folderPath)} // 폴더 클릭 시, 해당 폴더 경로로 이동하는 함수를 호출합니다.
        >
          <span className={`icon depth-${folderDepth}`}></span>
          <span>{folderName}</span>
        </div>
      );

      // 하위 폴더가 있으면 현재 폴더의 자식들을 재귀적으로 출력합니다. (자식 폴더들도 renderFolderTree 함수 사용)
      const children = hasChildren ? renderFolderTree(folder.children, depth + 1) : null;

      return (
        <React.Fragment key={index}>
          {folderNode}
          {children}
        </React.Fragment>
        // 현재 폴더의 JSX 요소를 출력합니다.
        // 자식 폴더들의 JSX 요소를 출력합니다. (null인 경우 출력하지 않음)
      );
    });
  };
  //



  //파일 리스트
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/v1/file?currentPath=${encodeURIComponent(currentPath)}`);
      const file = await response.json();
      setFiles(file.result);
      // console.log(file);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentPath]);
  //파일 리스트

  //파일 체크박스
  const [selectedFilePaths, setSelectedFilePaths] = useState([]);

  const handleCheckboxChange = (e, filePath) => {
    if (e.target.checked) {
      if (selectedFilePaths.length < 5) {
        setSelectedFilePaths([...selectedFilePaths, filePath]);
      } else {
        alert("최대 5개의 파일까지 선택할 수 있습니다.");
        e.target.checked = false;
      }
    } else {
      setSelectedFilePaths(selectedFilePaths.filter(path => path !== filePath));
    }
  };
  //파일 체크박스


  //업로드기능
  const [selectedFile, setSelectedFile] = useState();
  const fileInputRef = useRef();

  const handleFileChange = async (e) => {
    if (e.target.files.length > 0) {
      let filesToUpload = Array.from(e.target.files).slice(0, 5);

      // 파일 용량 확인
      filesToUpload = filesToUpload.filter((file) => {
        if (file.size > 5 * 1024 * 1024) { // 5MB 초과시 경고 메시지 표시
          alert(`${file.name} 파일은 용량이 5MB를 초과했습니다. 업로드되지 않습니다.`);
          return false;
        }
        return true;
      });

      // 5개 이상 파일 업로드되면 경고 메시지 표시
      if (e.target.files.length > 5) {
        alert("최대 5개의 파일까지 업로드할 수 있습니다. 초과한 파일은 무시됩니다.");
      }

      if (filesToUpload.length > 0) {
        await handleSubmit(filesToUpload);
      }
    }
  };

  const handleSubmit = async (filesToUpload) => {
    const formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("data", new Blob([JSON.stringify({ currentPath: currentPath })], { type: 'application/json' }));

    try {
      const response = await fetch('/api/v1/file/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 200) {
        alert('업로드가 완료되었습니다!');
        fetchFiles(); // 업로드 완료 후 파일 목록 업데이트
      } else {
        alert('업로드에 실패하였습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleClick = () => {
    fileInputRef.current.click();
  };
  //업로드기능

  //다운로드기능
  const handleDownload = async () => {
    if (selectedFilePaths.length === 0) {
      alert("다운로드할 파일을 선택해주세요.");
      return;
    }

    if (window.confirm("선택된 파일을 다운로드 하시겠습니까?")) {
      try {
        const response = await fetch("/api/v1/file/download", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPath: currentPath, filePaths: selectedFilePaths }),
        });

        // console.log(selectedFilePaths);

        if (response.status === 200) {
          const contentDisposition = response.headers.get("Content-Disposition");

          let fileName = contentDisposition
            ? contentDisposition.split("filename=")[1]
            : selectedFilePaths.length > 1
              ? "downloaded_files.zip"
              : "default_file_name.ext";

          fileName = fileName.replace(/['"]/g, "").replace(/^\//, ""); // 따옴표 제거

          if (fileName.endsWith("1")) {
            fileName = fileName.slice(0, -1);
          } //파일 확장자 뒤 '1' 제거

          // console.log(fileName);

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        } else {
          alert("다운로드 실패! 서버에서 오류가 발생했습니다.");
        }
      } catch (error) {
        console.error("다운로드 중 오류가 발생했습니다:", error);
      }
    }

  };
  //다운로드기능


  //삭제기능
  const handleDelete = async () => {
    if (selectedFilePaths.length === 0) {
      alert('삭제할 파일 체크박스를 선택해주세요.');
      return;
    }

    // console.log(selectedFilePaths);

    if (window.confirm("삭제하시겠습니까?")) {
      try {
        const response = await fetch('/api/v1/file', {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filePaths: selectedFilePaths }), // 파일 경로 배열을 JSON 객체로 전송
        });

        if (response.status === 200) {
          alert('파일이 삭제되었습니다!');
          fetchFiles();
        } else {
          alert('파일 삭제에 실패하였습니다.');
        }
      } catch (error) {
        alert('파일 삭제 중 문제가 발생했습니다. 다시 시도해주세요.');
        console.error(error);
      }
    } else {
    }
  };
  //삭제기능

  //새폴더
  const handleAddFolder = async () => {
    const folderName = window.prompt("새 폴더 이름을 입력하세요:");

    // 폴더 이름이 비어 있지 않는지 확인
    if (folderName && folderName.trim()) {
      try {
        const response = await fetch('/api/v1/file/add-folder', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentPath, folderName }),
        });

        if (response.status === 200) {
          alert("새 폴더가 생성되었습니다.");
          fetchFiles();
        } else {
          const errorMessage = await response.text();
          alert(`Error: ${errorMessage}`);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    } else {
    }
  };
  //새폴더

  //폴더 이동
  const handleFolderClick = (folderPath) => {
    setCurrentPath(folderPath);
    setSelectedFilePaths([]); // 폴더 이동 시 선택한 체크박스 초기화
  };
  //폴더 이동


  //이전 폴더 이동
  const handleGoBack = () => {
    const pathParts = currentPath.split('/');

    // 경로가 이미 루트일 경우 확인
    if (pathParts.length <= 2) {
      alert("최상위 폴더입니다.");
      return;
    }

    // 마지막 폴더 및 이전 폴더로 이동할 인덱스 제거
    pathParts.pop();
    pathParts.pop();

    // 경로 배열을 다시 문자열로 바꾸기 전에 마지막 슬래시를 추가
    if (pathParts.length >= 1 && pathParts[pathParts.length - 1] !== "") {
      pathParts.push("");
    }

    const newPath = pathParts.join('/');
    setCurrentPath(newPath);
  };
  //이전 폴더 이동


  return (
    <div className="sheetcloud_box">

      <div className="sheetcloud_back" onClick={() => { navigate(-1) }}> 나가기 </div>

      <div className='sheetcloud_left'>
        <div className="sheetcloud_title">시트 데이터 관리</div>
        <div className="sheetcloud_folder">{renderFolderTree(folders)}</div>
      </div>


      <div className='sheetcloud_right'>


        <div className='sheetcloud_currentPath'>
          현재 폴더 위치 : {currentPath}
          <img src="/img/back.png" alt="img" className="sheetcloud_goback" onClick={() => handleGoBack()} />
        </div>

        <div className='sheetcloud_buttons'>


          <Button
            onClick={handleAddFolder}
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#12A3CC',
              height: '4.5vh',
              width: '8vw',
              borderRadius: '10px',
              fontSize: '1.4vw',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#0F6983' }
            }}>
            새폴더
          </Button>

          <form>
            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              onClick={handleClick}
              type="button"
              variant="contained"
              sx={{
                backgroundColor: '#12A3CC',
                height: '4.5vh',
                width: '8vw',
                borderRadius: '10px',
                fontSize: '1.4vw',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#0F6983' }
              }}>
              업로드
            </Button>
          </form>

          <Button
            onClick={handleDownload}
            variant="contained"
            sx={{
              backgroundColor: '#12A3CC',
              height: '4.5vh',
              width: '8vw',
              borderRadius: '10px',
              fontSize: '1.4vw',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#0F6983' }
            }}>
            다운로드
          </Button>

          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              backgroundColor: '#808080',
              height: '4.5vh',
              width: '8vw',
              borderRadius: '10px',
              fontSize: '1.4vw',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#464646' }
            }}>
            삭제
          </Button>
        </div>

        <div className='sheetcloud_list'>

          <div style={{ margin: "20px" }}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th>선택</th>
                  <th>이름</th>
                  <th>유형</th>
                  <th>파일 크기</th>
                  <th>생성 날짜</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.path}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedFilePaths.includes(file.filePath)}
                        onChange={(e) => handleCheckboxChange(e, file.filePath)}
                      />
                    </td>
                    <td
                      className={file.extension === "폴더" ? "clickable" : ""}
                      onClick={file.extension === "폴더" ? () => handleFolderClick(file.filePath) : null}
                    >
                      {file.fileName}
                    </td>
                    <td>{file.extension}</td>
                    <td>{file.fileSize}</td>
                    <td>{file.registeredAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <span className='sheetcloud_warning'> * 5MB 초과, 파일 5개 이상 불가 </span>

        </div>

      </div>


    </div>
  )
}

export default SheetCloud;