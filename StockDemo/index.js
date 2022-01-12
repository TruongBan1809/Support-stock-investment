//API key
const API_KEY = "1EVA3Y2P1SNCC3O1";


const symbolInputField = document.getElementById('symbol-input');
const submitBtn = document.getElementsByClassName('btn-sub')[0];

let overview, balanceSheet, incomeStatement;


submitBtn.onclick = async () => {
    const compInfoElement = document.querySelector('.company-info');
    compInfoElement.innerHTML=`
        <div style="display:flex">
            <div class="spinner-border text-primary text-center my-5 mx-auto"></div>
        </div>
    `
    const symbolInput = symbolInputField.value;
    const overviewAPI = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbolInput}&apikey=${API_KEY}`;
    const balanceSheetAPI = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${symbolInput}&apikey=${API_KEY}`;
    const incomeStatementAPI = `https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=${symbolInput}&apikey=${API_KEY}`;
    // Lay dl tu API
    const getData = async () => {
        try {
            [overview, balanceSheet, incomeStatement] =await  Promise.all([
                fetch(overviewAPI).then((res1) => res1.json()),
                fetch(balanceSheetAPI).then((res2) => res2.json()),
                fetch(incomeStatementAPI).then((res3) => res3.json())
            ])
                //Dùng quarterlyReports nếu muốn theo quý annualReports nếu muốn theo năm
                .then(([res1, res2, res3]) => [res1, [...res2.quarterlyReports], [...res3.quarterlyReports]])
        }
        catch (err) {
            renderError();
        };
    }
    await getData();
    const { Name, Description, CIK, Exchange, Currency, Country, Address, PERatio } = { ...overview };
    const { totalAssets, totalCurrentAssets, totalCurrentLiabilities, totalLiabilities } = { ...balanceSheet[0] };
    const { grossProfit, netIncome } = { ...incomeStatement[0] };

    const ROARatio = netIncome / totalAssets, activityRatio = grossProfit / totalAssets,
        liquidity = totalCurrentAssets / totalCurrentLiabilities, debtRatio = totalLiabilities / totalAssets;

    const res = rule(ROARatio, activityRatio, liquidity, debtRatio, PERatio);
    
    // Render giao diện nếu tồn tại cả 5 chỉ số cơ bản
    if (res !== undefined) {
        renderInfo(Name, Description, CIK, Exchange, Currency, Country, Address);
        renderDecision(ROARatio, activityRatio, liquidity, debtRatio, PERatio, res);
    }
    else{
        renderError();
    }
}

// Luật
function rule(ROARatio, activityRatio, liquidity, debtRatio, PERatio) {
    switch (true) {
        //1
        case (ROARatio <= 1 && activityRatio > 1 && liquidity > 1 && debtRatio <= 1 && PERatio <= 1):
            return true;
        //2
        case (ROARatio > 1 && activityRatio > 1 && liquidity <= 1 && debtRatio <= 1 && PERatio <= 1):
            return true;
        //3
        case (ROARatio > 1 && activityRatio > 1 && liquidity > 1 && debtRatio <= 1 && PERatio <= 1):
            return true;
        //4
        case (ROARatio > 1 && activityRatio > 1 && liquidity > 1 && debtRatio <= 1 && PERatio > 1):
            return true;
        //5
        case (ROARatio > 1 && activityRatio > 1 && liquidity > 1 && debtRatio > 1 && PERatio > 1):
            return false;
        //6
        case (ROARatio > 1 && activityRatio > 1 && liquidity > 1 && debtRatio > 1 && PERatio <= 1):
            return false;
        //7
        case (ROARatio > 1 && activityRatio > 1 && liquidity <= 1 && debtRatio > 1 && PERatio > 1):
            return false;
        //8
        case (ROARatio > 1 && activityRatio > 1 && liquidity <= 1 && debtRatio > 1 && PERatio <= 1):
            return false;
        //9
        case (ROARatio > 1 && activityRatio > 1 && liquidity <= 1 && debtRatio <= 1 && PERatio > 1):
            return true;
        //10
        case (ROARatio > 1 && activityRatio <= 1 && liquidity > 1 && debtRatio > 1 && PERatio > 1):
            return false;
        //11
        case (ROARatio > 1 && activityRatio <= 1 && liquidity > 1 && debtRatio > 1 && PERatio <= 1):
            return false;
        //12
        case (ROARatio > 1 && activityRatio <= 1 && liquidity > 1 && debtRatio <= 1 && PERatio > 1):
            return false;
        //13
        case (ROARatio > 1 && activityRatio <= 1 && liquidity > 1 && debtRatio <= 1 && PERatio <= 1):
            return false;
        //14
        case (ROARatio > 1 && activityRatio <= 1 && liquidity <= 1 && debtRatio > 1 && PERatio > 1):
            return false;
        //15
        case (ROARatio > 1 && activityRatio <= 1 && liquidity <= 1 && debtRatio > 1 && PERatio <= 1):
            return false;
        //16
        case (ROARatio > 1 && activityRatio <= 1 && liquidity <= 1 && debtRatio <= 1 && PERatio <= 1):
            return false;
        //17
        case (ROARatio <= 1 && activityRatio > 1 && liquidity > 1 && debtRatio > 1 && PERatio > 1):
            return false;
        //18
        case (ROARatio <= 1 && activityRatio > 1 && liquidity > 1 && debtRatio > 1 && PERatio <= 1):
            return false;
        //19
        case (ROARatio <= 1 && activityRatio > 1 && liquidity > 1 && debtRatio <= 1 && PERatio > 1):
            return true;
        //20
        case (ROARatio <= 1 && activityRatio <= 1 && liquidity <= 1 && debtRatio <= 1 && PERatio > 1):
            return false;
        //21
        case (ROARatio <= 1 && activityRatio > 1 && liquidity <= 1 && debtRatio > 1 && PERatio > 1):
            return false;
        //22
        case (ROARatio <= 1 && activityRatio > 1 && liquidity <= 1 && debtRatio > 1 && PERatio <= 1):
            return false;
        //23
        case (ROARatio <= 1 && activityRatio > 1 && liquidity <= 1 && debtRatio <= 1 && PERatio <= 1):
            return false;
        //24
        case (ROARatio <= 1 && activityRatio <= 1 && liquidity > 1 && debtRatio > 1 && PERatio > 1):
            return false;
        //25
        case (ROARatio <= 1 && activityRatio <= 1 && liquidity > 1 && debtRatio > 1 && PERatio <= 1):
            return false;
        //26
        case (ROARatio <= 1 && activityRatio <= 1 && liquidity > 1 && debtRatio <= 1 && PERatio > 1):
            return false;
        //27
        case (ROARatio <= 1 && activityRatio <= 1 && liquidity > 1 && debtRatio <= 1 && PERatio <= 1):
            return false;
        //28
        case (ROARatio <= 1 && activityRatio <= 1 && liquidity <= 1 && debtRatio > 1 && PERatio > 1):
            return false;
        //29
        case (ROARatio <= 1 && activityRatio <= 1 && liquidity <= 1 && debtRatio > 1 && PERatio <= 1):
            return false;
        //30
        case (ROARatio <= 1 && activityRatio <= 1 && liquidity <= 1 && debtRatio <= 1 && PERatio <= 1):
            return false;
        //31
        case (ROARatio <= 1 && activityRatio > 1 && liquidity <= 1 && debtRatio <= 1 && PERatio > 1):
            return false;
        //32
        case (ROARatio > 1 && activityRatio <= 1 && liquidity <= 1 && debtRatio <= 1 && PERatio > 1):
            return false;
    }
}

// Render thông tin công ty
function renderInfo(cmpName, des, cik, exchange, currency, country, address) {
    const compInfoElement = document.querySelector('.company-info');
    console.log(compInfoElement);
    const html = `
        <div>
            <h2 class="compName">${cmpName}</h2>
        </div>
        <div>
            <h4>Description:</h4>
            <p class="description">${des}</p>
        </div>
        <div>
            <span class='label font-weight-bold'>
                CIK:
            </span>
                <span class="stock-CIK">${cik}</span>
            </div>
        <div>
            <span class='label font-weight-bold'>
                Stock exchange name:
            </span>
            <span class="stock-exchange">${exchange}</span>
        </div>
        <div>
            <span class='label font-weight-bold'>Currency:</span>
            <span class="currency">${currency}</span>
        </div>
        <div>
            <span class='label font-weight-bold'>Country:</span>
            <span class="country">${country}</span>
        </div>
        <div>
            <span class='label font-weight-bold'>Address:</span>
            <span class="address">${address}</span>
        </div>
    `
    compInfoElement.innerHTML = html;
}


// Render 5 chỉ số và quyết định có nên đầu tư
function renderDecision(ROARatio, activityRatio, liquidity, debtRatio, PERatio, res) {
    const decisionContainerElement = document.querySelector('.decision-container.mt-4.text-center');
    const html = `
        <div class='mb-3'>
            <span class='ratio-label font-weight-bold text-primary'>ROA ratio:</span>
            <span class="roa-ratio">${ROARatio}</span>
        </div>
        <div class='mb-3'>
            <span class='ratio-label font-weight-bold text-primary'>Activity ratio:</span>
            <span class="activity-ratio">${activityRatio}</span>
        </div>
        <div class='mb-3'>
            <span class='ratio-label font-weight-bold text-primary'>Liquidity:</span>
            <span class="liquidity-ratio">${liquidity}</span>
        </div>
        <div class='mb-3'>
            <span class='ratio-label font-weight-bold text-primary'>Debt ratio:</span>
            <span class="debt-ratio">${debtRatio}</span>
        </div>
        <div class='mb-3'>
            <span class='ratio-label font-weight-bold text-primary'>PE ratio:</span>
            <span class="PE-ratio">${PERatio}</span>
        </div>
        <span class="decision-label font-weight-bold text-uppercase mt-5 ${res ? 'text-success' : 'text-danger'} ">${res ? 'Attractive' : 'Unattractive'}</span>
    `
    decisionContainerElement.innerHTML=html;
}

function renderError(){
    const compInfoElement = document.querySelector('.company-info');
    html=`
        <div class='alert alert-danger' style="margin: 80px 0px">
            <strong>Có lỗi!!!</strong> Mã cổ phiếu nhập và bị sai hoặc chưa có dữ liệu. Vui lòng nhập lại mã!!
        </div>
    `
    compInfoElement.innerHTML=html;
}
