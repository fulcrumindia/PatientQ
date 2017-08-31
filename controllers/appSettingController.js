const KioskSetting = require('../model/KioskSetting');
module.exports = {
    addKioskSetting : function(req, res){
      setting = req.body;
      KioskSetting.addKioskSetting(setting, (err, settings) =>{
        if(err){
            //console.log(err);
            throw err;
        }
      }); 
       res.redirect('/app');
    }
}