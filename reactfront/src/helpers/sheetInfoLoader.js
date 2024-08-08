import axios from "axios";

class SheetPage {
  /**
   * @property {number} page_num - 페이지 번호
   * @property {Object<string, SheetTable|SheetCell|SheetText|SemanticText>} all_objs - 모든 객체들. key: id, value: 객체
   * @property {Array<SheetTable>} inner_tables - 내부 표 리스트
   * @property {Array<SheetText>} inner_texts - 표 밖에 위치한 텍스트 리스트
   * @property {boolean} is_target - 인식 대상 여부
   * @property {number} width - 이미지 너비
   * @property {number} height - 이미지 높이
   * @property {string} original_img_path - 원본 이미지 경로
   * @property {string} rebuilt_img_path - 재구성 이미지 경로
   * @property {Array<Array<number>>} obj_map - 각 픽셀에 객체 id를 저장한 2차원 배열, 마우스 클릭 좌표로 객체 찾을 때 사용
   */

  constructor(page_num, is_target, width, height, project_dir) {
    this.page_num = page_num;
    this.all_objs = {};
    this.inner_tables = [];
    this.inner_texts = [];
    this.is_target = is_target;
    this.obj_map = null;
    this.width = width;
    this.height = height;
    this.original_img_path = `${page_num}_original_img.png`;
    this.rebuilt_img_path = `${page_num}_rebuilt_img.png`;
  }
}

class SheetTable {
  /**
   * @property {string} id - 고유번호
   * @property {Array<Array<number>>} conner_points - 꼭짓점 좌표 [[x1, y1], [x2, y2]...]
   * @property {SheetCell} outer_cell - 표 안에 표인 경우, 이 표를 포함하고 있는 외부 셀
   * @property {Array<SheetCell>} inner_cells - 표 내부 셀 리스트
   */

  constructor(id, conner_points) {
    this.id = id;
    this.conner_points = conner_points;
    this.outer_cell = null;
    this.inner_cells = [];
  }
}

class SheetCell {
  /**
   * @property {string} id - 고유번호
   * @property {Array<Array<number>>} conner_points - 꼭짓점 좌표 [[x1, y1], [x2, y2]...]
   * @property {SheetTable} parent - 부모 표
   * @property {Object<string, Array<SheetCell>>} morp_link_cell - 연결된 셀들. key: 방향, value: 셀 리스트
   * @property {Array<SheetText>} inner_texts - 내부 텍스트 리스트
   * @property {Array<SheetTable>} inner_tables - 내부 표 리스트. 셀 내부에 표가 없으면 빈 리스트
   * @property {Array<SemanticText>} inner_semantic_texts - 내부 의미 텍스트 리스트
   * @property {Array<string>} properties - 속성 리스트. 비어 있을 수 있음
   * @property {Array<string>} values - 값 리스트. 비어 있을 수 있음
   * @property {Array<string>} separated_properties - 분리된 속성 리스트. 비어 있을 수 있음
   * @property {Array<string>} units - 단위 리스트. 비어 있을 수 있음
   */
  constructor(id, conner_points) {
    this.id = id;
    this.conner_points = conner_points;
    this.parent = null;
    this.morp_link_cell = {};
    this.inner_texts = [];
    this.inner_tables = [];
    this.inner_semantic_texts = [];
    this.properties = [];
    this.values = [];
    this.separated_properties = [];
    this.units = [];
  }
}

class SheetText {
  /**
   * @property {string} id - 고유번호
   * @property {Array<Array<number>>} conner_points - 꼭짓점 좌표 [[x1, y1], [x2, y2]...]
   * @property {string} text - 텍스트
   * @property {SheetCell} parent - 부모 셀
   */

  constructor(id, conner_points, text) {
    this.id = id;
    this.conner_points = conner_points;
    this.text = text;
    this.parent = null;
  }
}

class SemanticText {
  /**
   * @property {string} id - 고유번호
   * @property {Array<Array<number>>} conner_points - 꼭짓점 좌표 [[x1, y1], [x2, y2]...]
   * @property {string} text - 텍스트
   * @property {string} type - 의미 분류 key|value|separator|unit|annotation
   * @property {Array<string>} properties - 속성. type이 key인 경우 요소가 1개, separator인 경우 요소가 2개 이상, unit인 경우 없음
   * @property {string} unit - 단위. type이 unit인 경우만 존재
   * @property {SheetCell} parent - 부모 셀
   */
  constructor(id, conner_points, text, type, properties, unit) {
    this.id = id;
    this.conner_points = conner_points;
    this.text = text;
    this.type = type;
    this.properties = properties;
    this.unit = unit;
    this.parent = null;
  }
}

const ID_PLACE_TABLE = [9, 10];
const ID_PLACE_CELL = [5, 8];
const ID_PLACE_CLASSIFIER = [4, 4];
const ID_PLACE_TEXT = [1, 3];

export class SheetInfoManager {
  /** @param {string} project_folder - json 파일이 위치한 경로 */
  constructor(project_folder) {
    this.project_folder = project_folder;
  }

  async load_sheet_info() {
    const sheet_info_json = await this.#load_sheet_info_json(
      this.project_folder
    );
    this.sheet_pages = this.#load_sheet_info_obj(sheet_info_json);
  }

  async #load_sheet_info_json(project_folder) {
    const response = await axios.get(project_folder);

    return response.data;
  }

  /**
   * @param {string} sheet_info_json - json 문자열 데이터
   * @return {Object<number, SheetPage>} - sheet page 객체들
   */
  #load_sheet_info_obj(sheet_info_json) {
    let sheet_pages = {};

    for (let sheet_page_node of sheet_info_json["object_info"][
      "sheet page list"
    ]) {
      let page_num = sheet_page_node["page num"];
      let is_target = sheet_page_node["is target"];
      let width = sheet_page_node["width"];
      let height = sheet_page_node["height"];
      let sheet_page = new SheetPage(
        page_num,
        is_target,
        width,
        height,
        this.project_folder
      );
      sheet_pages[page_num] = sheet_page;

      // 객체 생성===
      for (let sheet_obj_node of sheet_page_node["all objs"]) {
        if (sheet_obj_node["class"] === "sheet table") {
          let sheet_table = new SheetTable(
            sheet_obj_node["id"],
            sheet_obj_node["conner points"]
          );
          sheet_page.all_objs[sheet_table.id] = sheet_table;
        } else if (sheet_obj_node["class"] === "sheet cell") {
          let sheet_cell = new SheetCell(
            sheet_obj_node["id"],
            sheet_obj_node["conner points"]
          );
          sheet_page.all_objs[sheet_cell.id] = sheet_cell;
        } else if (sheet_obj_node["class"] === "sheet text") {
          let sheet_text = new SheetText(
            sheet_obj_node["id"],
            sheet_obj_node["conner points"],
            sheet_obj_node["text"]
          );
          sheet_page.all_objs[sheet_text.id] = sheet_text;
        } else if (sheet_obj_node["class"] === "semantic text") {
          let semantic_text = new SemanticText(
            sheet_obj_node["id"],
            sheet_obj_node["conner points"],
            sheet_obj_node["text"],
            sheet_obj_node["type"],
            sheet_obj_node["key"],
            sheet_obj_node["unit"]
          );
          sheet_page.all_objs[semantic_text.id] = semantic_text;
        }
      }
      // ===객체 생성

      // 객체 연결===
      for (let inner_table_id of sheet_page_node["inner tables"]) {
        sheet_page.inner_tables.push(sheet_page.all_objs[inner_table_id]);
      }

      for (let inner_text_id of sheet_page_node["inner texts"]) {
        sheet_page.inner_texts.push(sheet_page.all_objs[inner_text_id]);
      }

      for (let sheet_obj_node of sheet_page_node["all objs"]) {
        let id = sheet_obj_node["id"];

        if (sheet_obj_node["class"] === "sheet table") {
          let sheet_table = sheet_page.all_objs[id];

          // outer cell 연결
          let outer_cell_id = sheet_obj_node["outer cell"];
          if (outer_cell_id) {
            sheet_table.outer_cell = sheet_page.all_objs[outer_cell_id];
          } else {
            sheet_table.outer_cell = null;
          }

          // inner cell 연결
          for (let inner_cell_id of sheet_obj_node["inner cells"]) {
            sheet_table.inner_cells.push(sheet_page.all_objs[inner_cell_id]);
          }
        } else if (sheet_obj_node["class"] === "sheet cell") {
          let sheet_cell = sheet_page.all_objs[id];

          // parent 연결
          let parent_id = sheet_obj_node["parent"];
          sheet_cell.parent = sheet_page.all_objs[parent_id];

          // morp link cell 연결
          for (let [direction, link_cell_ids] of Object.entries(
            sheet_obj_node["morp link cells"]
          )) {
            sheet_cell.morp_link_cell[direction] = [];
            for (let link_cell_id of link_cell_ids) {
              sheet_cell.morp_link_cell[direction].push(
                sheet_page.all_objs[link_cell_id]
              );
            }
          }

          // inner text 연결
          for (let inner_text_id of sheet_obj_node["inner texts"]) {
            sheet_cell.inner_texts.push(sheet_page.all_objs[inner_text_id]);
          }

          // inner table 연결
          for (let inner_table_id of sheet_obj_node["inner tables"]) {
            sheet_cell.inner_tables.push(sheet_page.all_objs[inner_table_id]);
          }
        } else if (sheet_obj_node["class"] === "sheet text") {
          let sheet_text = sheet_page.all_objs[id];

          // parent 연결
          let parent_id = sheet_obj_node["parent"];
          if (parent_id) {
            sheet_text.parent = sheet_page.all_objs[parent_id];
          } else {
            sheet_text.parent = null;
          }
        } else if (sheet_obj_node["class"] === "semantic text") {
          let semantic_text = sheet_page.all_objs[id];

          // parent 연결
          let parent_id = sheet_obj_node["parent"];
          semantic_text.parent = sheet_page.all_objs[parent_id];
          semantic_text.parent.inner_semantic_texts.push(semantic_text);

          if (semantic_text.type === "key") {
            semantic_text.parent.properties.concat(semantic_text.properties);
          } else if (semantic_text.type === "separator") {
            semantic_text.parent.separated_properties.concat(
              semantic_text.properties
            );
          } else if (semantic_text.type === "unit") {
            semantic_text.parent.units.push(semantic_text.unit);
          } else if (semantic_text.type === "value") {
            semantic_text.parent.values.push(semantic_text.text);
          }
        }
      }
      // ===객체 연결
    }
    return sheet_pages;
  }

  make_obj_map() {
    console.log("make_obj_map");
    for (let sheet_page of Object.values(this.sheet_pages)) {
      // obj_map 초기화
      sheet_page.obj_map = new Array(sheet_page.width);
      for (let i = 0; i < sheet_page.width; i++) {
        sheet_page.obj_map[i] = new Array(sheet_page.height).fill(0);
      }

      // obj_map에 객체 id 저장
      for (let sheet_table of sheet_page.inner_tables) {
        for (let sheet_cell of sheet_table.inner_cells) {
          console.log("assign_obj_id_to_map");
          this.#assign_obj_id_to_map(sheet_page.obj_map, sheet_cell);

          for (let sheet_text of sheet_cell.inner_texts) {
            this.#assign_obj_id_to_map(sheet_page.obj_map, sheet_text);
          }
        }
      }
    }
  }

  #assign_obj_id_to_map(obj_map, sheet_obj) {
    // 사각형이면
    if (sheet_obj.conner_points.length === 4) {
      let [x1, y1] = sheet_obj.conner_points[0];
      let [x2, y2] = sheet_obj.conner_points[2];

      for (let x = x1; x <= x2; x++) {
        for (let y = y1; y <= y2; y++) {
          obj_map[x][y] = sheet_obj.id;
        }
      }
    }
    // 사각형이 아니면
    else {
      this.#make_boundary(obj_map, sheet_obj.conner_points, sheet_obj.id); // 경계를 그리고
      let point = this.#get_random_point_in_polygon(sheet_obj.conner_points); // 경계 안의 한 점을 선택하고
      this.#fill_boundary(obj_map, point, sheet_obj.id); // 그 점을 시작으로 경계 내부를 채움
    }
  }

  #fill_boundary(obj_map, point, obj_id) {
    let stack = [point];

    while (stack.length > 0) {
      let [x, y] = stack.pop();

      // 범위를 벗어나거나, 이미 채워진 경우, 또는 경계를 만난 경우 종료
      if (
        x < 0 ||
        x >= obj_map.length ||
        y < 0 ||
        y >= obj_map[0].length ||
        obj_map[x][y] !== 0 ||
        obj_map[x][y] === obj_id
      ) {
        continue;
      }

      // 현재 위치를 채움
      obj_map[x][y] = obj_id;

      // 상하좌우로 확장
      stack.push([x - 1, y]); // 왼쪽
      stack.push([x + 1, y]); // 오른쪽
      stack.push([x, y - 1]); // 위
      stack.push([x, y + 1]); // 아래
    }
  }

  #make_boundary(obj_map, vertices, obj_id) {
    for (let i = 0; i < vertices.length; i++) {
      let start = vertices[i];
      let end = vertices[(i + 1) % vertices.length]; // 다음 꼭짓점, 마지막 꼭짓점의 경우 첫 번째 꼭짓점으로 연결

      // 선분의 시작점과 끝점 사이의 모든 점을 계산
      let points = this.#get_line_points(start, end);

      // 각 점에 대해 obj_map에 obj_id를 할당
      for (let point of points) {
        let [x, y] = point;
        obj_map[x][y] = obj_id;
      }
    }
  }

  #get_line_points(start, end) {
    let points = [];

    let [x1, y1] = start;
    let [x2, y2] = end;

    // 수평선인 경우
    if (y1 === y2) {
      let minX = Math.min(x1, x2);
      let maxX = Math.max(x1, x2);
      for (let x = minX; x <= maxX; x++) {
        points.push([x, y1]);
      }
    }
    // 수직선인 경우
    else if (x1 === x2) {
      let minY = Math.min(y1, y2);
      let maxY = Math.max(y1, y2);
      for (let y = minY; y <= maxY; y++) {
        points.push([x1, y]);
      }
    }

    return points;
  }

  #is_point_in_polygon(x, y, vertices) {
    // 'ray casting' 알고리즘을 사용하여 점이 다각형 내부에 있는지 확인합니다.
    // 이 알고리즘은 점에서 임의의 방향으로 '선'을 그어, 그 선이 다각형의 변과 몇 번 교차하는지 세는 방법입니다.

    let inside = false;

    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      let xi = vertices[i][0],
        yi = vertices[i][1];
      let xj = vertices[j][0],
        yj = vertices[j][1];

      let intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  #get_random_point_in_polygon(vertices) {
    // 다각형의 바운딩 박스
    let minX = Math.min(...vertices.map((v) => v[0]));
    let maxX = Math.max(...vertices.map((v) => v[0]));
    let minY = Math.min(...vertices.map((v) => v[1]));
    let maxY = Math.max(...vertices.map((v) => v[1]));

    // 바운딩 박스에서 무작위로 점 하나 선택
    let x, y;
    do {
      x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
      y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    } while (!this.#is_point_in_polygon(x, y, vertices));

    return [x, y];
  }

  get_sheet_obj_by_id(page_num, obj_id) {
    return this.sheet_pages[page_num].all_objs[obj_id];
  }

  get_sheet_page(page_num) {
    return this.sheet_pages[page_num];
  }

  /**
   * @param page_num {number} - 페이지 번호
   * @param type {string} - "cell"|"table"|"text"|"semantic text" 가져오길 원하는 객체 타입
   * @param x {number} - 마우스 클릭 x 좌표
   * @param y {number} - 마우스 클릭 y 좌표
   * @return {SheetTable|SheetCell|SheetText|SemanticText|null} - 좌표에 대응되는 객체. 없으면 null 반환
   */
  get_sheet_obj_by_point(page_num, type, x, y) {
    let obj_map = this.sheet_pages[page_num].obj_map;
    let obj_id = obj_map[x][y];
    if (obj_id === 0) {
      return null;
    }

    if (type === "cell") {
      obj_id = this.#separate_id(obj_id, "cell");
      if (obj_id === null) {
        return null;
      }
      return this.get_sheet_obj_by_id(page_num, obj_id);
    } else if (type === "table") {
      obj_id = this.#separate_id(obj_id, "table");
      if (obj_id === null) {
        return null;
      }
      return this.get_sheet_obj_by_id(page_num, obj_id);
    } else if (type === "text") {
      obj_id = this.#separate_id(obj_id, "text");
      if (obj_id === null) {
        return null;
      }
      return this.get_sheet_obj_by_id(page_num, obj_id);
    } else if (type === "semantic text") {
      obj_id = this.#separate_id(obj_id, "cell");
      if (obj_id === null) {
        return null;
      }
      let sheet_cell = this.get_sheet_obj_by_id(page_num, obj_id);
      let selected_semantic_text = null;
      for (let semantic_text of sheet_cell.inner_semantic_texts) {
        if (this.#is_point_in_polygon(x, y, semantic_text.conner_points)) {
          selected_semantic_text = semantic_text;
          break;
        }
      }
      return selected_semantic_text;
    } else {
      return null;
    }
  }

  #separate_id(obj_id, obj_class) {
    let table_id = this.#extract_digits(obj_id, ID_PLACE_TABLE);
    let cell_id = this.#extract_digits(obj_id, ID_PLACE_CELL);
    let classifier = this.#extract_digits(obj_id, ID_PLACE_CLASSIFIER);
    let text_id = this.#extract_digits(obj_id, ID_PLACE_TEXT);

    if (obj_class === "table") {
      if (table_id !== 0) {
        return table_id * Math.pow(10, ID_PLACE_TABLE[0] - 1);
      }
    } else if (obj_class === "cell") {
      if (cell_id !== 0) {
        return (
          table_id * Math.pow(10, ID_PLACE_TABLE[0] - 1) +
          cell_id * Math.pow(10, ID_PLACE_CELL[0] - 1)
        );
      }
    } else if (obj_class === "text") {
      if (text_id !== 0) {
        return (
          table_id * Math.pow(10, ID_PLACE_TABLE[0] - 1) +
          cell_id * Math.pow(10, ID_PLACE_CELL[0] - 1) +
          classifier * Math.pow(10, ID_PLACE_CLASSIFIER[0] - 1) +
          text_id
        );
      }
    }
    return null;
  }

  #extract_digits(num, place) {
    let str_num = num.toString();
    let start_index = str_num.length - place[1];
    let end_index = str_num.length - place[0] + 1;
    return parseInt(str_num.substring(start_index, end_index));
  }
}
