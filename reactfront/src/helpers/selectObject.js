export default function visualize_image(sheet_info_manager, PAGE, imgSrc) {
  let grid_item1 = document.getElementById("grid-item1");

  let img = new Image();
  //   img.src = sheet_info_manager.sheet_pages[PAGE].rebuilt_img_path;
  img.src = imgSrc;
  img.onload = function () {
    // img.width = 500; // 너비를 200픽셀로 설정
    // img.height = 500; // 높이를 100픽셀로 설정

    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = 0.5;

    // canvas 클릭 이벤트 생성
    canvas.addEventListener("click", function (e) {
      //canvas 크기와 실제 이미지 크기 비율 계산
      let scaleX = img.width / canvas.clientWidth;
      let scaleY = img.height / canvas.clientHeight;

      // 클릭한 좌표를 이미지 좌표로 변환
      let x = Math.floor(e.offsetX * scaleX);
      let y = Math.floor(e.offsetY * scaleY);

      // 선택된 객체 가져오기
      let obj_class = document.querySelector(
        'input[name="object"]:checked'
      ).value;

      let selected_obj = sheet_info_manager.get_sheet_obj_by_point(
        PAGE,
        obj_class,
        x,
        y
      );

      // 선택된 객체 가시화
      if (selected_obj !== null) {
        // canvas 그림 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = `rgb(255, 0, 0)`;
        ctx.beginPath();

        // 선택된 객체 경계선 그리기 및 채우기
        ctx.moveTo(
          selected_obj.conner_points[0][0],
          selected_obj.conner_points[0][1]
        );
        for (let i = 1; i < selected_obj.conner_points.length; i++) {
          ctx.lineTo(
            selected_obj.conner_points[i][0],
            selected_obj.conner_points[i][1]
          );
        }
        ctx.closePath();
        ctx.fill();

        // 선택된 객체 정보 출력===
        let grid_item2 = document.getElementById("grid-item2");
        let output_text = `id: ${selected_obj.id}<br><br>`;
        if (obj_class === "table") {
          output_text += `number of inner cells: ${selected_obj.inner_cells.length}`;
        } else if (obj_class === "cell") {
          output_text += `number of inner texts: ${selected_obj.inner_texts.length}<br><br>`;
          output_text += "inner texts: ";
          for (let text of selected_obj.inner_texts) {
            output_text += `${text.text};  `;
          }
        } else if (obj_class === "text") {
          output_text += `text: ${selected_obj.text}`;
        } else if (obj_class === "semantic text") {
          output_text += `text: ${selected_obj.text}<br><br>`;
          output_text += `type: ${selected_obj.type}<br><br>`;
          if (selected_obj.type === "separator") {
            output_text += `separated properties: ${selected_obj.properties.join(
              "; "
            )}<br><br>`;
          }
        }
        grid_item2.innerHTML = output_text;
        // ===선택된 객체 정보 출력
      }
    });

    grid_item1.innerHTML = "";
    grid_item1.appendChild(canvas);
  };
}
