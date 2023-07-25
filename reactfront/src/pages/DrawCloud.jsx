import cloud from './Cloud.module.css';
import React, { useEffect, useRef, useState } from 'react';
import { Button, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function DrawCloud() {

  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState("draw/");


  //왼쪽 폴더 리스트 불러오기
  const [folders, setFolders] = useState([]);

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

  useEffect(() => {
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
      folderName: "draw",
      folderPath: "draw/",
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
          className={`${cloud[`folder-node`]} ${cloud[`depth-${folderDepth}`]}`} // 각 깊이에 해당하는 클래스 이름을 추가합니다.
          onClick={() => handleFolderClick(folderPath)} // 폴더 클릭 시, 해당 폴더 경로로 이동하는 함수를 호출합니다.
        >
          <span className={`${cloud.icon} ${cloud[`depth-${folderDepth}`]}`}></span>
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
    const filesSize = filesToUpload.reduce((total, file) => {
      return total + file.size;
    }, 0);

    const filesSizeMB = filesSize / (1024 * 1024);

    if (filesSizeMB + (originalVolume / (1024 * 1024)) > 10) {
      alert("파일 용량 합과 원래 볼륨을 합한 값이 10MB를 초과했습니다. 업로드 불가능합니다.");
      return;
    }


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
        fetchVolume();
      } else if (response.status === 409) {
        alert("파일 이름이 중복되었습니다.");
      } else {
        alert("업로드에 실패하였습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };
  //업로드기능


  function customEscape(str) {
    var result = "";

    for (var i = 0; i < str.length; i++) {
      var charCode = str.charCodeAt(i);

      if (
        charCode === 0x2D ||          // "-"
        charCode === 0x5F ||          // "_"
        charCode === 0x2E ||          // "."
        charCode === 0x7E ||          // "~"
        (charCode >= 0x30 && charCode <= 0x39) ||  // 숫자 0-9
        (charCode >= 0x41 && charCode <= 0x5A) ||  // 대문자 A-Z
        (charCode >= 0x61 && charCode <= 0x7A)     // 소문자 a-z
      ) {
        result += str.charAt(i);
      } else {
        result += "%" + charCode.toString(16).toUpperCase();
      }
    }

    return result;
  }

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
          let fileName = decodeURIComponent(customEscape(contentDisposition.split("filename=")[1]));
          // let fileName = decodeURIComponent(escape(contentDisposition.split("filename=")[1]));
          console.log(fileName);

          // let fileName = fileTo
          // ? contentDisposition.split("filename=")[1]
          // : selectedFilePaths.length > 1
          //   ? "downloaded_files.zip"
          //   : "default_file_name.ext";

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

    console.log(selectedFilePaths);

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
          fetchFolders();
          fetchVolume();
          setSelectedFilePaths([]);
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

  //이름변경
  const handleChangeName = async () => {
    if (selectedFilePaths.length !== 1) {
      alert("1개 파일을 선택해주세요.");
      return;
    }

    console.log(selectedFilePaths);
    const currentFilePath = selectedFilePaths[0];
    const currentName = currentFilePath.split("/").pop();
    const extension = currentName.split('.').pop();

    if (currentFilePath.endsWith('/')) {
      alert("폴더 이름 변경은 지원하지 않습니다.");
      return;
    }

    const updateName = window.prompt("새로운 파일 이름을 입력해주세요:");

    if (updateName && updateName.trim()) { // 파일 이름이 비어 있지 않은 경우

      // 특수 문자 및 길이 확인
      if (validateName(updateName)) {
        try {
          const response = await fetch('/api/v1/file', {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ currentPath, currentName, updateName, extension, }),
          });

          if (response.status === 200) {
            alert("파일 이름이 변경되었습니다.");
            fetchFiles();
            setSelectedFilePaths([]);
          } else {
            const errorMessage = await response.text();
            alert(`Error: ${errorMessage}`);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      } else {
        alert("파일 이름에 최대 100자가 넘거나 허용되지 않는 특수 문자가 포함되어 있습니다. 공백, #, %, /, \, *, ?, <, >, |, :, . 같은 특수 문자는 사용할 수 없습니다.");
      }
    } else {
      alert("이름 변경이 취소되었습니다.");
    }
  };
  //이름변경

  //새폴더
  const handleAddFolder = async () => {
    const folderDepth = currentPath.split('/').length - 1;
    const numberOfFolders = folders.length;

    if (folderDepth >= 2) {
      alert("하위 폴더를 생성할 수 없습니다.");
      return;
    }

    if (numberOfFolders >= 20) {
      alert('15개 이상의 폴더 생성이 불가능합니다.');
      return;
    }

    const folderName = window.prompt("새 폴더 이름을 입력하세요:");

    // 폴더 이름이 비어 있지 않는지 확인
    if (folderName && folderName.trim()) {
      // 특수 문자 및 길이 확인
      if (validateName(folderName)) {
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
            fetchFolders();
          } else {
            const errorMessage = await response.text();
            alert(`Error: ${errorMessage}`);
          }
        } catch (error) {
          console.log("Error:", error);
        }
      } else {
        alert("폴더 이름에 최대 100자가 넘거나 허용되지 않는 특수 문자가 포함되어 있습니다. 공백, #, %, /, \, *, ?, <, >, |, :, . 같은 특수 문자는 사용할 수 없습니다.");
      }
    } else {
    }
  };
  //새폴더

  // 폴더 및 파일 이름에 대한 제한 확인
  const validateName = (name) => {
    const maxLength = 100;
    const invalidCharsRegex = /[ \#%./*?<>|:\\]/;

    if (name.length > maxLength || invalidCharsRegex.test(name)) {
      return false;
    }

    return true;
  };
  // 폴더 및 파일 이름에 대한 제한 확인


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

  // 정렬 기능
  const [sortOrder, setSortOrder] = useState();
  const [sortType, setSortType] = useState();

  const handleNameHeaderClick = () => {
    if (sortOrder === null || sortOrder === 'desc') {
      setSortOrder('asc');
    } else {
      setSortOrder('desc');
    }
    setSortType('name');
  };

  useEffect(() => {
    const sortedFiles = [...files];
    if (sortType === 'name') {
      if (sortOrder === 'asc') {
        sortedFiles.sort((a, b) => a.fileName.localeCompare(b.fileName));
      } else if (sortOrder === 'desc') {
        sortedFiles.sort((a, b) => b.fileName.localeCompare(a.fileName));
      }
    } else {
    }
    setFiles(sortedFiles);
  }, [sortOrder, sortType]);
  // 정렬 기능

  //용량
  const [currentVolume, setCurrentVolume] = useState("");
  const [originalVolume, setOriginalVolume] = useState(0);

  const fetchVolume = async () => {
    try {
      const response = await fetch('/api/v1/file/get-volume?currentPath=draw/');
      const data = await response.json();
      setCurrentVolume(data.result.volume);
      setOriginalVolume(data.result.originalVolume);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchVolume();
  }, []);


  const maxVolume = 10;
  const originalVolumeMB = originalVolume / 1048576;
  const percentageUsed = (originalVolumeMB / maxVolume) * 100;
  // console.log(percentageUsed);
  // console.log(currentVolume, originalVolume);
  //용량


  return (
    <div className={cloud.cloud_box}>

      <Button
        className={cloud.cloud_back}
        onClick={() => { navigate(-1) }}
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: '#cc3712',
          height: '45px',
          width: '120px',
          borderRadius: '10px',
          fontSize: '25px',
          fontWeight: 600,
          '&:hover': { backgroundColor: '#85240c' }
        }}>
        나가기
      </Button>

      <div className={cloud.cloud_left}>
        <div className={cloud.cloud_title}>도면 데이터 관리</div>
        <div className={cloud.cloud_folder}>{renderFolderTree(folders)}</div>
      </div>

      <div className={cloud.cloud_volume}>
        <p className={cloud.cloud_volumetxt}>사용 용량 : {currentVolume} / {maxVolume} MB</p>
        <LinearProgress className={cloud.cloud_linearprogress} variant="determinate" value={percentageUsed} />
      </div>


      <div className={cloud.cloud_right}>


        <div className={cloud.cloud_currentPath}>
          현재 폴더 위치 : {currentPath}
          <Button
            className={cloud.cloud_goback}
            onClick={() => handleGoBack()}
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#808080',
              height: '25px',
              width: '20px',
              marginLeft: '10px',
              borderRadius: '10px',
              fontSize: '12px',
              '&:hover': { backgroundColor: '#464646' }
            }}>
            상위폴더
          </Button>
        </div>

        <div className={cloud.cloud_buttons}>


          <Button
            onClick={handleAddFolder}
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#12A3CC',
              height: '45px',
              width: '120px',
              borderRadius: '10px',
              fontSize: '25px',
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
                backgroundColor: '#14c4f5',
                height: '45px',
                width: '120px',
                borderRadius: '10px',
                fontSize: '25px',
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
              height: '45px',
              width: '120px',
              borderRadius: '10px',
              fontSize: '25px',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#0F6983' }
            }}>
            다운로드
          </Button>

          <Button
            onClick={handleChangeName}
            variant="contained"
            sx={{
              backgroundColor: '#14c4f5',
              height: '45px',
              width: '120px',
              borderRadius: '10px',
              fontSize: '25px',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#0F6983' }
            }}>
            이름변경
          </Button>

          <Button
            onClick={handleDelete}
            variant="contained"
            sx={{
              backgroundColor: '#808080',
              height: '45px',
              width: '120px',
              borderRadius: '10px',
              fontSize: '25px',
              fontWeight: 600,
              '&:hover': { backgroundColor: '#464646' }
            }}>
            삭제
          </Button>
        </div>

        <div className={cloud.cloud_list}>
          <div className={cloud.category}>
            <table className={cloud.table}>
              <thead className={cloud.thead}>
                <tr className={cloud.tr}>
                  <th className={cloud.th}>선택</th>
                  <th className={cloud.th} onClick={handleNameHeaderClick}>
                    이름
                    <span className={`${cloud['sort-indicator']} ${cloud[sortOrder === 'asc' ? 'asc' : 'desc']}`} />
                  </th>
                  <th className={cloud.th}>유형</th>
                  <th className={cloud.th}>파일 크기</th>
                  <th className={cloud.th}>생성 날짜</th>
                </tr>
              </thead>
            </table>
            <div className={cloud.cell}>
              <table className={cloud.table}>
                <tbody className={cloud.tbody}>
                  {files.map((file) => (
                    <tr className={cloud.tr} key={file.path}>
                      <td className={cloud.td}>
                        <input type='checkbox' checked={selectedFilePaths.includes(file.filePath)}
                          onChange={(e) => handleCheckboxChange(e, file.filePath)} />
                      </td>
                      <td className={file.extension === '폴더' ? cloud.clickable : ''}
                        onClick={file.extension === '폴더' ? () => handleFolderClick(file.filePath) : null}>
                        {file.fileName}
                      </td>
                      <td className={cloud.td}>{file.extension}</td>
                      <td className={cloud.td}>{file.fileSize}</td>
                      <td className={cloud.td}>{file.registeredAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DrawCloud;