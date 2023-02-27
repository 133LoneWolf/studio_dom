window.onload = settingsStart();

function settingsStart(){
    var el_date = document.getElementById('date_main');
    var curr_date = new Date().toISOString().split('T')[0];
    el_date.setAttribute("value", curr_date);
}

// Declarando váriáveis
const dateTaskCont = document.getElementById('new_date_task');
const newDateCont = document.getElementById('date_cont');
const exportButton = document.getElementById('export_btn');
var emp_cont = 0;
var date_cont = 0;
var taskRowId = 0;
var arrDataVerify = [];
var orderedEmpList;

// Novo grupo de tarefas
dateTaskCont.addEventListener('click', ()=>{
    newDateTask();
    date_cont++;
});

// Exportar para excell
exportButton.addEventListener('click', ()=>{
    buildSpreadSheet(orderedEmpList)
});




// Functions                                            ******
function dateWindowSize(event){
    let evtIdx = event.currentTarget.id.substr(10);
    let currEmp, boxId, toolboxId, toolBoxSrc, prvTxtVal;

    let dateWindow = document.getElementById('dateWindow'+evtIdx);
    let currWindow = document.getElementById('employees'+evtIdx);

    evtIdx.includes('_Altr')? boxId = 'rowBox'+evtIdx.substr(1) : boxId = 'box'+evtIdx;
    evtIdx.includes('_Altr')? toolboxId = 'tool_box'+evtIdx.substr(1) : toolboxId = 'tool_box'+evtIdx;
    evtIdx.includes('_main')? prvTxtVal = 1 : prvTxtVal = parseInt(evtIdx.substr(6)) + 2;

    var topRow = currWindow.style.display;
    toolBoxSrc = document.getElementById(toolboxId);
    currEmp = document.getElementById(boxId);

    if(topRow === '' || topRow === 'block' || topRow === 'flex'){
        currWindow.style.display = "none";
        currEmp.style.display = 'none';
        toolBoxSrc.style.display = 'none';
        dateWindow.textContent = `exibir grupo (${prvTxtVal})`;
    }else{
        currWindow.style.display = "flex";
        currEmp.style.display = "block";
        toolBoxSrc.style.display = "flex";
        dateWindow.textContent = `ocultar grupo (${prvTxtVal})`;
    }
}

// Criando nova linha para uma mesma data
function newEmployee(event){
    var dateTask, dateTaskId;
    var idxTar = event.currentTarget.id;
    var newEmpId = idxTar.substr(12);
    var elEmpCont = createEmployeeRow('custom', newEmpId);

    idxTar.includes('_Altr')? dateTaskId = 'rowBox' + newEmpId : dateTaskId = 'box'+newEmpId;
    dateTask = document.getElementById(dateTaskId);
    dateTask.appendChild(elEmpCont);
}

// Excluindo linha de uma mesma data
function cancelRow(event){
    let btnSrc = event.srcElement.id;
    let idxSrc = btnSrc.substr(9);

    // removendo elemento do array Fechamento
    let rvElArr = event.currentTarget.parentElement.id;
    arrDataVerify.pop(rvElArr);

    var el_emp = document.getElementById('func'+idxSrc);
    var el_serv = document.getElementById('servic'+idxSrc);
    var el_qtd = document.getElementById('quant'+idxSrc);
    var el_btn = document.getElementById(btnSrc);

    el_emp.remove();
    el_serv.remove();
    el_qtd.remove();
    el_btn.remove();
}

// Excluindo todas as linhas
function clearAll(event, id){
    var evtIdSrc;
    if(id === '' || id === null || id === undefined){
        evtIdSrc = event.currentTarget.id;
    } else{
        evtIdSrc = id;
    }
    var evtIdI = evtIdSrc.substr(9);
    var SrcInd;

    evtIdI.includes('_Altr')? SrcInd = 'rowBox' : SrcInd = 'box';
    var cldWrapper = document.getElementById(SrcInd + evtIdI);
    var cldWrpCont = cldWrapper.childNodes;
    var cldWrpCount = cldWrpCont.length;

    var empId = 'func';
    var servId = 'servic';
    var qtdId = 'quant';
    var btnId = 'cancelBtn';
    var rowId = 'employees';
    var arrlistdel = [];

    for(var i = 1; i <= cldWrpCount; cldWrpCount--){
        if(i !== cldWrpCount){
            var el =  cldWrapper.childNodes[i].id;
            arrlistdel.push(el);
            let el2 = document.getElementById(el);
            el2.remove();
        }
    }
    arrDataVerify = arrDataVerify.filter( a => !arrlistdel.includes( a ) );
}


// Nova caixa de tarefas
function newDateTask(){
    var dtCount = document.getElementById('date_cont');
    if(dtCount.childNodes.length <= 14){
        'Hello World!'
    }else{
        let message = `         Ação inválida:
                        Você atingiu o limite total de 15 grupos de tarefas!!!`;
        templateMessage('confirm_only', 'enable', message);
        return true;
    }
     
    var idxSrc = '_Altr'+date_cont;
    var dtNew = document.createElement('div');
    //  Atribuindo ID
    dtNew.setAttribute('id', 'date_task'+idxSrc);
    dtNew.className = 'card card_wd my-5';

    // Declarando as divs
    var dateEmployee = document.createElement('div');
    dateEmployee.className = 'employees';
    var rowBox = document.createElement('div');
    rowBox.setAttribute('id', 'rowBox'+idxSrc)

    // Card header
    // dateBar
    var dateStr = createDateBar(idxSrc);

    // Card body
    var dateCardBody = document.createElement('div');
    dateCardBody.className = "card-body cont_hg card_wd";
    var cardBodyForm = document.createElement('form');
    cardBodyForm.className = "row g-3"; 
    
    // dateEmployee
    var dateEmployeeRow = createEmployeeRow('standard', idxSrc);
    rowBox.appendChild(dateEmployeeRow);

    // btnCont
    var empBtnCont = createEmpBtn(idxSrc);


    cardBodyForm.appendChild(rowBox);
    cardBodyForm.appendChild(empBtnCont);
    dateCardBody.appendChild(cardBodyForm);

    // Add divs
    dtNew.appendChild(dateStr);
    dtNew.appendChild(dateCardBody);

    newDateCont.appendChild(dtNew);
}


function removeGroup(event){
    var currId = event.currentTarget.id;
    var groupId = 'date_task'+ currId.substr(13);
    var groupCnt = document.getElementById(groupId);
    var clearId = 'clear_all'+currId.substr(13);
    
    clearAll('', clearId);
    groupCnt.remove();
} 

//                                               Elements
// Bar with input date
function createDateBar(id){
    var dateBarId, dateWrapper, dateIptGrp, dateBtnCol, dateBtn, dateSpan, dateCol2, dateIpt; 	

    dateBarId = 'set_date'+emp_cont+id;
    
    dateWrapper = document.createElement('div');
    dateWrapper.className = "card-header";
    dateWrapper.setAttribute('id', dateBarId);
    
    dateIptGrp = document.createElement('div');
    dateIptGrp.className = "input-group";
    
    dateBtnCol = document.createElement('div');
    dateBtnCol.className = "col";
    
    dateBtn = document.createElement('p');
    dateBtn.className = "btn btn-secondary";
    dateBtn.setAttribute('onClick', 'dateWindowSize(event)');
    dateBtn.setAttribute('id', 'dateWindow'+emp_cont+id);
    dateBtn.textContent = `ocultar grupo (${emp_cont+2})`;
    
    dateSpan = document.createElement('p');
    dateSpan.textContent = 'Selecione uma data:';
    dateSpan.className = "input-group-text";
    
    dateCol2 = document.createElement('div');
    dateCol2.className = "col col-md-2";
    
    dateIpt = document.createElement('input');
    dateIpt.className = "form-control";
    dateIpt.setAttribute('type', 'date');
    dateIpt.setAttribute('id', 'date'+id);
    
    
    dateCol2.appendChild(dateIpt);
    dateBtnCol.appendChild(dateBtn);
    
    dateIptGrp.appendChild(dateBtnCol);
    dateIptGrp.appendChild(dateSpan);
    dateIptGrp.appendChild(dateCol2);
    
    dateWrapper.appendChild(dateIptGrp);
    
    return dateWrapper;
}


//  Row with employee info
function createEmployeeRow(type, srcId){
    var empWrapper = document.createElement('div');
    empWrapper.setAttribute('id', 'employees'+emp_cont+srcId);
    // empWrapper.style.backgroundColor = "coral";
    var empType = type;
    
    // dateEmployee
    var el_emp = createSelectList('employee');
    el_emp.setAttribute('id', 'func'+emp_cont+srcId);
    el_emp.className = "form-select";
    
    var el_serv = createSelectList('category');
    el_serv.setAttribute('id', 'servic'+emp_cont+srcId);
    el_serv.className = "form-select";
    
    var el_qtd = document.createElement('input');
    el_qtd.setAttribute('id', 'quant'+emp_cont+srcId);
    el_qtd.className = "form-control";
    
    var el_btn = document.createElement('button');
    el_btn.setAttribute('id', 'cancelBtn'+emp_cont+srcId);
    el_btn.className = "btn btn-dark";
    el_btn.setAttribute('onclick', 'cancelRow(event)');
    el_btn.textContent = 'x';
    
    el_emp.setAttribute('type', 'text');
    el_emp.setAttribute('placeholder', 'Funcionário');
    el_serv.setAttribute('type', 'text');
    el_serv.setAttribute('placeholder', 'Serviço');
    el_qtd.setAttribute('type', 'text');
    el_qtd.setAttribute('placeholder', 'Valor');
    
    empType === 'custom'? 'Not custom' : el_btn.style.visibility = 'hidden';
    
    empWrapper.appendChild(el_emp);
    empWrapper.appendChild(el_serv);
    empWrapper.appendChild(el_qtd);
    empWrapper.appendChild(el_btn);
    empWrapper.className = 'employees';
    
    emp_cont++;
    arrDataVerify.push(empWrapper.id);
    return empWrapper;
}

function createSelectList(type){
    var constructType, nOption, fstOption;
    var arrEl = document.createElement('select');
    var arrEmp = ['Angela', 'Bernadette','Beatriz','Elma','Fabiola','José','Kelly','Kimberly','Lesley','Roberta'];
    var arrCat = ['Cabelo - Feminino','Cabelo - Masculino', 'Depilação','Estética','Extensão de cilios','Manicure','Outros', 'Vale'];
    var arrCatId = ['Cabelo_Fem', 'Cabelo_Mas', 'Depilacao', 'Estetica', 'Extensao_cil', 'Manicure', 'Outros','Vale'];
    
    type === 'employee'? constructType = arrEmp : constructType = arrCat;
    type === 'employee'? fstOption = 'Funcionario:' : fstOption = 'Categoria:';
    var fstOptionEl = document.createElement('option');
    fstOptionEl.setAttribute('value', fstOption);
    fstOptionEl.textContent = fstOption;
    fstOptionEl.disabled = 'true';
    fstOptionEl.selected = 'true';

    arrEl.appendChild(fstOptionEl);

    for(var i = 0; i < constructType.length; i++){
        nOption = document.createElement('option');
        type === 'employee'? nOption.setAttribute('value', constructType[i]) : nOption.setAttribute('value', arrCatId[i]);
        nOption.textContent = constructType[i];

        arrEl.appendChild(nOption);

    }

    return arrEl;
}

//  Container of buttons
function createEmpBtn(id){
    var empBtnCont = document.createElement('div');
    empBtnCont.className = "col-12";
    empBtnCont.setAttribute('id', 'tool_box'+id);
    
    // btnCont
    var newTaskBtn = document.createElement('p');
    newTaskBtn.setAttribute('id', 'add_employee'+id);
    newTaskBtn.setAttribute('onClick', 'newEmployee(event)');
    newTaskBtn.textContent = 'Adicionar nova tarefa';
    newTaskBtn.className = "btn btn-primary";
    // newTaskBtn.role = "group";

    var clearTaskBtn = document.createElement('p');
    clearTaskBtn.setAttribute('id', 'clear_all'+id);
    clearTaskBtn.setAttribute('onClick', "clearAll(event, '')");
    clearTaskBtn.textContent = 'Limpar tarefas';
    clearTaskBtn.className = "btn btn-danger";

    var removeTaskBtn = document.createElement('p');
    removeTaskBtn.setAttribute('id', 'removeTaskBtn'+id);
    removeTaskBtn.setAttribute('onClick', 'removeGroup(event)');
    removeTaskBtn.textContent = 'remover grupo';
    removeTaskBtn.className = "btn btn-danger";

    var btnGroupWrp = document.createElement('div');
    btnGroupWrp.className = "btn-group";
    btnGroupWrp.role = "group";
    btnGroupWrp.appendChild(newTaskBtn);
    btnGroupWrp.appendChild(clearTaskBtn);
    btnGroupWrp.appendChild(removeTaskBtn);

    empBtnCont.appendChild(btnGroupWrp);

    return empBtnCont;
}


////                                 Calculo Fechamento
// Fechamento Contábil
function RealizarFechamento(){
    var arrEmpList = [];


    // Criando um Array de objetos   ******
    var empName, empCtg, empVal, empDate;

    // Recuperando valores
    let iptList = document.querySelectorAll('input');

    for(var i =0; i < iptList.length; i++){
        var employeeTask = {
            Nome: '', Categoria: '', Valor: 0, Data: empDate,
            Valor_empresa: '', Valor_funcionário: ''
        };

        if(iptList[i].id.includes('date')){
            var empDateStr = iptList[i].value;
            empDate = empDateStr.substring(8,10)+'/'+empDateStr.substring(5,7)+'/'+empDateStr.substring(0,4);
            employeeTask.Data = empDate;
            if(empDate === '//'){
                let msg = `         Ação inválida:
                    Campos de data não podem estar 
                    vazios aos realizar o Fechamento!!!`;
                templateMessage('confirm_only', 'enable', msg);
                return true
            }
        }else{
            let ListId = iptList[i].id.substring(5);
            empName = document.getElementById('func'+ListId).value;
            employeeTask.Nome = empName;
            empCtg = document.getElementById('servic'+ListId).value;
            employeeTask.Categoria = empCtg;
            empVal = document.getElementById('quant'+ListId).value;
            // empVal.includes(',') ? empVal.replace(',', '.') : 'Hello World';
            employeeTask.Valor = empVal;

            if(empName === '' || empCtg === '' || empVal === ''){
                let msg = `         Ação inválida:
                            Preencha os campos vazios 
                            para realizar o Fechamento!!!`;
                templateMessage('confirm_only', 'enable', msg);
                return true;
            };
            arrEmpList.push(employeeTask);
        }
    }

    // Cálculo do Fechamento Contábil
    var objCtgVal = {Cabelo_Mas: '70', Cabelo_Fem: '50', Depilacao: '60', 
    Estetica: '70', Extensao_cil: '60', Manicure: '70', Outros: '10', Vale: '0'};

    // montando campos Valor empresa e valor funcionario
    for(var i = 0; i <= (arrEmpList.length - 1); i++){
        // empName, empCtg, empVal, empDate
        empCtg = arrEmpList[i].Categoria;
        empVal = arrEmpList[i].Valor;
        let percentNum, Valor_empresa, valor_func;
        percentNum = objCtgVal[empCtg];
        
        percentNum === '0'? valor_func = percentNum : valor_func = ((empVal / 100)* percentNum);
        
        Valor_empresa = (empVal - valor_func).toFixed(2);
        let fixValorFunc = (valor_func).toFixed(2);
        valor_func.toFixed(2);
        arrEmpList[i].Valor_empresa = Valor_empresa;
        arrEmpList[i].Valor_funcionário = fixValorFunc;
    }

    // console.log(arrEmpList);
    if(arrEmpList != false){
        orderedEmpList = arrEmpList.sort((a, b) => a.Nome.localeCompare(b.Nome));
        CreateTableTask(orderedEmpList);
    }
}

function CreateTableTask(empData){
    var overlayTask = document.getElementById('overlay_Task');
    var taskTable = document.getElementById('task_table');
    var tskTableCont = document.getElementById('cont_table');
    var arrEmpName = ['Angela', 'Bernadette','Beatriz','Elma','Fabiola','José','Kelly','Kimberly','Lesley','Roberta'];; 
    
    var trCont, trIndex, trNome, trCategoria, trValor, trData, trValEmp, trValFunc;

    for(var j =0; j < arrEmpName.length; j++){
        var newArray = empData.filter(function (el){
            return el.Nome === arrEmpName[j];
        });

        if(newArray != false){
            let totVal = 0; let EmpVal = 0; let FuncVal = 0;
            // for(var i = 0; i <= newArray.length; i++){} 
            var i = 0;
            var iDate = '';
                do {
                    trCont = document.createElement('tr');
                    trCont.className = 'tRowSet';
                    
                    let arrTotVal, fixArrTotVal, arrFuncVal, fixArrFuncVal, arrEmpVal, fixArrEmpVal;
                    arrTotVal = ''+parseFloat(newArray[i].Valor).toFixed(2); fixArrTotVal = arrTotVal.replace('.', ',');
                    arrFuncVal = ''+newArray[i].Valor_funcionário; fixArrFuncVal = arrFuncVal.replace('.', ',');
                    arrEmpVal = ''+newArray[i].Valor_empresa; fixArrEmpVal = arrEmpVal.replace('.', ',');
            
                    trIndex = document.createElement('th'); trIndex.textContent = taskRowId+1;
                    trNome = document.createElement('td'); trNome.textContent = newArray[i].Nome;
                    trCategoria = document.createElement('td'); trCategoria.textContent = newArray[i].Categoria;
                    trData = document.createElement('td'); trData.textContent = newArray[i].Data;
                    trValor = document.createElement('td'); trValor.textContent = 'R$ '+fixArrTotVal;
                    trValEmp = document.createElement('td'); trValEmp.textContent = 'R$ '+fixArrFuncVal;
                    trValFunc = document.createElement('td'); trValFunc.textContent = 'R$ '+fixArrEmpVal;
            
                    trCont.appendChild(trIndex); trCont.appendChild(trNome); trCont.appendChild(trCategoria); 
                    trCont.appendChild(trData); trCont.appendChild(trValor); trCont.appendChild(trValEmp); 
                    trCont.appendChild(trValFunc);
                    
                    totVal = totVal + parseFloat(newArray[i].Valor).toFixed(2);
                    totVal = parseFloat(totVal).toFixed(2);
                    EmpVal = EmpVal + parseFloat(newArray[i].Valor_empresa);
                    FuncVal = FuncVal + parseFloat(newArray[i].Valor_funcionário);
                    taskRowId++;
                    taskTable.appendChild(trCont);

                    iDate = newArray[i].Data;
                    i++;
                } while (i < newArray.length);

            let trContT = document.createElement('tr');
            trContT.className = 'emphasized_row';

            let strTotVal, fixTotVal, strEmpVal, fixEmpVal, strFuncVal, fixFuncVal;
            strTotVal = ''+totVal; fixTotVal = strTotVal.replace('.', ',');
            strEmpVal  = ''+EmpVal; fixEmpVal = strEmpVal.replace('.', ',');
            strFuncVal = ''+FuncVal; fixFuncVal = strFuncVal.replace('.', ',');

            let trIndexT = document.createElement('th'); trIndexT.textContent = taskRowId+1;
            let trNomeT = document.createElement('td'); trNomeT.textContent = 'Total';
            let trCategoriaT = document.createElement('td');
            let trDataT = document.createElement('td'); trDataT.textContent = iDate;
            let trValorT = document.createElement('td'); trValorT.textContent = 'R$ '+fixTotVal;
            let trValEmpT = document.createElement('td'); trValEmpT.textContent = 'R$ '+fixEmpVal;
            let trValFuncT = document.createElement('td'); trValFuncT.textContent = 'R$ '+fixFuncVal;

            trContT.appendChild(trIndexT); trContT.appendChild(trNomeT); trContT.appendChild(trCategoriaT); 
            trContT.appendChild(trDataT); trContT.appendChild(trValorT); trContT.appendChild(trValFuncT);
            trContT.appendChild(trValEmpT); 
            
            taskRowId++;
            taskTable.appendChild(trContT);
        }
    }
    let mainDt = document.getElementById('date_task');
    let dateContDt = document.getElementById('date_cont');
    let newDt = document.getElementById('new_date_task');
    let FechamentoDt = document.getElementById('add');

    templateMessage('', 'disable', '');
    mainDt.style.display = 'none';
    dateContDt.style.display = 'none';
    newDt.style.display = 'none';
    FechamentoDt.style.display = 'none';
    tskTableCont.style.display = 'flex';
    overlayTask.style.display = 'block';
}

function templateMessage(btn, type, msg){
    let dialog = document.getElementById('conf_dialog');
    var overlayTask = document.getElementById('overlay_Task');
    var btn1 = document.getElementById('dialog_btn1');
    var btn2 = document.getElementById('dialog_btn2');
    let DialogInfo = document.getElementById('alert_p');
    DialogInfo.innerHTML = msg;

    if(type === 'disable'){ 
        overlayTask.style.display = 'none'; 
        dialog.style.display = 'none'; 
        document.body.style.overflow = 'auto';
    }
    else if(type === 'enable'){
        dialog.style.display = 'block';
        overlayTask.style.display = 'block';
        document.body.style.overflow = 'hidden';
        overlayTask.style.display = 'block';
        window.scrollTo(0, 0);
    }if(type === 'fechamento'){
        dialog.style.display = 'block';
        document.body.style.overflow = 'hidden';
        overlayTask.style.display = 'block';
        window.scrollTo(0, 0);   
    }

    if(btn === 'confirm_only'){
        btn1.style.display = 'block';
        btn2.style.display = 'none';
        btn1.innerHTML = 'Entendi';
    }else if (btn === 'multi_options'){
        btn2.style.display = 'block';
        btn1.innerHTML = 'Cancelar';
        btn2.innerHTML = 'Prosseguir';
    }else if (btn === ''){
        btn1.style.display = 'none';
        btn2.style.display = 'none';
    }
}

function handleTable(event){
    var evtTableId = event.currentTarget.id;
    var tskTableCont = document.getElementById('cont_table');
    let mainDt = document.getElementById('date_task');
    let dateContDt = document.getElementById('date_cont');
    let newDt = document.getElementById('new_date_task');
    let FechamentoDt = document.getElementById('add');

    if(evtTableId.includes('add')){
        let message = `Realizando fechamento contabil...`;
        templateMessage('', 'fechamento', message);
        setTimeout(function(){
            RealizarFechamento();
        },1000);
    }
    else if(evtTableId.includes('_new')){
        setTimeout(() => {
            document.location.reload();
          }, 1000);
    }
    else if(evtTableId.includes('_btn1')){

        templateMessage('', 'disable', '');

    }else if(evtTableId.includes('_edit')){
        templateMessage('', 'disable', '');
        tskTableCont.style.display = 'none';
        mainDt.style.display = 'block';
        dateContDt.style.display = 'block';
        newDt.style.display = 'block';
        FechamentoDt.style.display = 'block';
        newFechamento();
    }

}

function newFechamento(){
    var taskTable = document.getElementById('task_table');
    var tTableLen = taskTable.childNodes.length;

    for(var i = 1; i <= tTableLen; tTableLen--){
        taskTable.lastChild.remove();
    }
}

function buildSpreadSheet(orderedEmpList){
    const csvName = 'Relatorio Fechamento '+new Date().toISOString().split('T')[0];
    const exportBtn = document.querySelector('[data-js="export-table"]');

    var empString = `Nome;Tipo Serviço;Data;Valor total;Valor funcionario;Valor empresa`+'\n';

    for(var i = 0; i < orderedEmpList.length; i++){
        var totalVal = orderedEmpList[i].Valor.replace('.',',');
        var fixtotalVal = totalVal.replace('.',',');
        var funcVal = ''+ orderedEmpList[i].Valor_funcionário;
        var fixfuncVal = funcVal.replace('.',',');
        var emplVal = ''+ orderedEmpList[i].Valor_empresa;
        var fixemplVal = emplVal.replace('.',',');
        let strRow = `${orderedEmpList[i].Nome};${orderedEmpList[i].Categoria};${orderedEmpList[i].Data};R$ ${fixtotalVal};R$ ${fixfuncVal};R$ ${fixemplVal}`+'\n';
        empString = empString + strRow;
    };

    console.log(empString);
    const exportTable = () =>{

        const CSVString = empString;
        var universalBOM = "\uFEFF";

        exportBtn.setAttribute(
            'href', `data:text/csv; charset=utf-8,${encodeURIComponent(universalBOM+CSVString)}`
        )
        exportBtn.setAttribute('download', csvName+'.csv');
    }
    exportTable();
}