var all_drafts = {};
chrome.storage.local.get('RIR_DRAFTS', function(result) {
    if (result.RIR_DRAFTS) {
        all_drafts = JSON.parse(result.RIR_DRAFTS);
    }
});

var drafts = {
    getAllKeys: function(){
        const user = this.username;
        if(typeof all_drafts[user] === "undefined") {
            all_drafts[user] = [];
            chrome.storage.local.set({ 'RIR_DRAFTS': JSON.stringify(all_drafts) });
        }
        return all_drafts[user];
    },
    get: function(key){
        const user = this.username;
        const callback = this.callback;
        chrome.storage.local.get('RIR_DRAFT_' + user + '_' + key, function(result) {
            var obj_raw = result['RIR_DRAFT_' + user + '_' + key];
            if(!obj_raw) return callback(false);

            // Update timestamp
            var obj = JSON.parse(obj_raw);
            obj.timestamp = (new Date()).getTime();
            chrome.storage.local.set({ ['RIR_DRAFT_' + user + '_' + key]: JSON.stringify(obj) });

            callback(obj.value);
        });
    },
    set: function(key, value){
        const callback = this.callback;
        const user = this.username;

        if(!value) return drafts.delete.call(this, key, callback);

        const draft = {
            key: key,
            timestamp: new Date().getTime(),
            value: value
        };
        chrome.storage.local.set({ ['RIR_DRAFT_' + user + '_' + key]: JSON.stringify(draft) });

        if(typeof all_drafts[user] === "undefined") all_drafts[user] = [key]
        else if(all_drafts[user].indexOf(key) < 0) all_drafts[user].push(key);

        chrome.storage.local.set({ 'RIR_DRAFTS': JSON.stringify(all_drafts) });
        callback(true);
    },
    delete: function(key){
        const user = this.username;
        const callback = this.callback;
        chrome.storage.local.remove('RIR_DRAFT_' + user + '_' + key);

        const index = all_drafts[user].indexOf(key);
        if(index >= 0) {
            all_drafts[user].splice(index, 1);
            chrome.storage.local.set({ 'RIR_DRAFTS': JSON.stringify(all_drafts) });
            callback(true);
        } else {
            callback(false);
        }
    },
    deleteOld: function() {
        // iterate through all users
        var users = Object.keys(all_drafts);
        for(var i = 0; i < users.length; i++) {
            var user = users[i];

            // set cut off time
            var currentDate = new Date();
            var cutOffTime = currentDate.setDate(currentDate.getDate() - rir.cfg_user_get('deleteDraftAfterDays', user));

            // walk through all of this user's drafts
            var userDrafts = all_drafts[user];
            for(var j = 0; j < userDrafts.length; j++) {
                var draftKey = userDrafts[j];
                chrome.storage.local.get('RIR_DRAFT_' + user + '_' + draftKey, function(result) {
                    var draft_raw = result['RIR_DRAFT_' + user + '_' + draftKey];

                    // If the draft doesn't exist, delete the index
                    if(!draft_raw) {
                        userDrafts.splice(j--, 1);
                        return;
                    }

                    // If it does exist, check if it's too old
                    var draft = JSON.parse(draft_raw);
                    if(draft.timestamp < cutOffTime) {
                        // If it is too old, delete it, and its index
                        chrome.storage.local.remove('RIR_DRAFT_' + user + '_' + draftKey);
                        userDrafts.splice(j--, 1);
                    }
                });
            }
        }
        // Update the all_drafts object
        chrome.storage.local.set({ 'RIR_DRAFTS': JSON.stringify(all_drafts) });
    }
};

drafts.deleteOld();