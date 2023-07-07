/*
   arCallbacks:Array(1)
      0:
         config:{childList: true, subtree: false}
         fnToRun:"selectFirstImage"
         arParameters:[]
         order:1
         class:"div.images-container"
*/

   // complete following https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe#using_attributefilter
   const postLoad = {
      arPostLoad:[],
      addCallback(selector, options, functionName, parameters, runOrder, unique){
         runOrder=runOrder || false;
         unique=unique || false;

         let target=this.findEntry(selector);
         if(!runOrder)
            runOrder=target.arCallbacks.length;

         this.add( target,{fnToRun:functionName, config: options, arParameters: parameters, order: runOrder},unique);
      },
      run(target){
         if( target.class===undefined||target.class==="")
            return false;

         for(let action of target.arCallbacks){
            window[action.fnToRun]();
         }
      },
      evalClass(targetClass){
         if(targetClass.startsWith('prestashop'))
            targetClass=eval(target);
         return targetClass;
      },
      add(targetToStore, callback, unique){
         let found=false;
         if(unique)
            for( let idx in targetToStore.arCallbacks){
               if(targetToStore.arCallbacks[idx].fnToRun===callback.fnToRun){
                  found=true;
                  targetToStore.arCallbacks[idx].order=callback.order;
               }
            }
         if(!found) {
            targetToStore.arCallbacks.push(callback);
         }
         this.storePostLoad(targetToStore);
      },
      storePostLoad(targetToStore){
         let found=false;
         for( let idx in this.arPostLoad){
            if(this.arPostLoad[idx].class===targetToStore.class){
               found=true;
               this.arPostLoad[idx]=targetToStore;
            }
         }
         if(!found)
            this.arPostLoad.push(targetToStore);

         this.attachEvent(targetToStore);
      },
      attachEvent(target){
         var targetClass=this.evalClass(target.class);

         let DOMtarget = document.querySelector(targetClass).parentElement;

         for( action of target.arCallbacks){
            var observer = new MutationObserver( function(mutations){
               window[action.fnToRun](action.arParameters);
               mutations.forEach(function(mutation) {
                  console.log(mutation.type);
                  console.log(mutation.target);
                  console.log(mutation.addedNodes);
               });
            });
            var config = { childList: true, subtree: false };
            var obs=observer.observe(DOMtarget, config);
         }
      },
      findEntry(className){
         let found={class:className, arCallbacks:[]};
         for( let target of this.arPostLoad)
            if($(target).hasClass(className)){
               found=target;
               break;
            }
         return found;
      },
      checkAvailability(targetClass){
         found=false;
         for(container of prestashop.selectors)
            for(availableTarget of container)
               if(availableTarget===targetClass)
                  found=true;

         return found;
      },
      test(){
         console.log("OK");
         return "OK"
      }
   };

function selectFirstImage(showalert){
   showalert = showalert || false;
   document.querySelectorAll('.thumb-container img.thumb')[0].click();
   if(showalert) alert('OK');
}

postLoad.addCallback(
    'div.images-container',
    { childList: true, subtree: false },
    'selectFirstImage',
    [1],
    1);
