// ============================================
// DEMO JS - Shipment Tracking Simulation
// ============================================

$(document).ready(function () {

  const shipmentData = {
    'FREIGHT-001': {
      status: 'In Transit',
      details: 'Shipment departed from Mumbai. Estimated delivery: April 15, 2024',
      icon: 'fa-truck',
      color: '#22d3ee'
    },
    'FREIGHT-002': {
      status: 'Delivered',
      details: 'Successfully delivered on March 20, 2024',
      icon: 'fa-check-circle',
      color: '#10b981'
    },
    'FREIGHT-003': {
      status: 'Processing',
      details: 'Shipment is being processed at origin facility. Ready in 24 hours',
      icon: 'fa-clock',
      color: '#f59e0b'
    },
    'FREIGHT-004': {
      status: 'Customs Clearance',
      details: 'Shipment under customs clearance. Estimated: 2-3 days',
      icon: 'fa-file-alt',
      color: '#f59e0b'
    },
    'FREIGHT-005': {
      status: 'Out for Delivery',
      details: 'Shipment is out for final delivery. Expected today by 6 PM',
      icon: 'fa-truck-fast',
      color: '#22d3ee'
    }
  };

  $('#trackBtn').on('click', function () {
    const shipmentNumber = $('#shipmentNumber').val().trim().toUpperCase();

    if (!shipmentNumber) {
      showResult('error', 'Please enter a shipment number', 'Try: FREIGHT-001 to FREIGHT-005');
      return;
    }

    const data = shipmentData[shipmentNumber];

    if (data) {
      showResult('success', data.status, data.details, data.icon, data.color);
    } else {
      showResult('error', 'Shipment Not Found', 'Please enter a valid shipment number');
    }
  });

  $('.demo-suggestions span').on('click', function () {
    const value = $(this).text();
    $('#shipmentNumber').val(value);
    $('#trackBtn').click();
  });

  $('#shipmentNumber').on('keypress', function (e) {
    if (e.which === 13) {
      $('#trackBtn').click();
    }
  });

  function showResult(type, title, message, icon = 'fa-info-circle', color = '#6366f1') {
    const resultDiv = $('#demoResult');

    const html = `
            <div class="result-card">
                <i class="fas ${icon}" style="color: ${color};"></i>
                <div>
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            </div>
        `;

    resultDiv.html(html).fadeIn(200);

    if (type === 'error') {
      setTimeout(() => {
        resultDiv.fadeOut(300);
      }, 4000);
    }
  }

});